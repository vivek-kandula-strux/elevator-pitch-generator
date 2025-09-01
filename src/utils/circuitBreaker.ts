import { supabase } from '@/integrations/supabase/client';

export enum CircuitState {
  CLOSED = 'closed',
  OPEN = 'open',
  HALF_OPEN = 'half_open'
}

interface CircuitBreakerData {
  service_name: string;
  state: CircuitState;
  failure_count: number;
  success_count: number;
  last_failure_at?: string;
  last_success_at?: string;
  failure_threshold: number;
  recovery_timeout_minutes: number;
}

export class CircuitBreaker {
  private serviceName: string;
  private failureThreshold: number;
  private recoveryTimeoutMinutes: number;

  constructor(
    serviceName: string,
    failureThreshold: number = 5,
    recoveryTimeoutMinutes: number = 5
  ) {
    this.serviceName = serviceName;
    this.failureThreshold = failureThreshold;
    this.recoveryTimeoutMinutes = recoveryTimeoutMinutes;
  }

  async canExecute(): Promise<boolean> {
    const state = await this.getState();
    
    if (state.state === CircuitState.CLOSED) {
      return true;
    }
    
    if (state.state === CircuitState.OPEN) {
      const recoveryTime = new Date(state.last_failure_at!);
      recoveryTime.setMinutes(recoveryTime.getMinutes() + state.recovery_timeout_minutes);
      
      if (new Date() > recoveryTime) {
        await this.setState(CircuitState.HALF_OPEN);
        return true;
      }
      return false;
    }
    
    if (state.state === CircuitState.HALF_OPEN) {
      return true;
    }
    
    return false;
  }

  async recordSuccess(): Promise<void> {
    const state = await this.getState();
    
    if (state.state === CircuitState.HALF_OPEN) {
      await this.setState(CircuitState.CLOSED, { resetFailures: true });
    } else {
      await supabase
        .from('circuit_breaker_state')
        .update({
          success_count: state.success_count + 1,
          last_success_at: new Date().toISOString()
        })
        .eq('service_name', this.serviceName);
    }
  }

  async recordFailure(): Promise<void> {
    const state = await this.getState();
    const newFailureCount = state.failure_count + 1;
    
    const updates: any = {
      failure_count: newFailureCount,
      last_failure_at: new Date().toISOString()
    };
    
    if (newFailureCount >= state.failure_threshold) {
      updates.state = CircuitState.OPEN;
    }
    
    await supabase
      .from('circuit_breaker_state')
      .update(updates)
      .eq('service_name', this.serviceName);
  }

  private async getState(): Promise<CircuitBreakerData> {
    const { data, error } = await supabase
      .from('circuit_breaker_state')
      .select('*')
      .eq('service_name', this.serviceName)
      .single();

    if (error || !data) {
      // Create default state if not exists
      const defaultState = {
        service_name: this.serviceName,
        state: CircuitState.CLOSED,
        failure_count: 0,
        success_count: 0,
        failure_threshold: this.failureThreshold,
        recovery_timeout_minutes: this.recoveryTimeoutMinutes
      };

      const { data: newData, error: insertError } = await supabase
        .from('circuit_breaker_state')
        .insert(defaultState)
        .select()
        .single();

      if (insertError || !newData) {
        throw new Error(`Failed to create circuit breaker state: ${insertError?.message}`);
      }

      return newData as CircuitBreakerData;
    }

    return data as CircuitBreakerData;
  }

  private async setState(
    newState: CircuitState,
    options: { resetFailures?: boolean } = {}
  ): Promise<void> {
    const updates: any = { state: newState };
    
    if (options.resetFailures) {
      updates.failure_count = 0;
    }
    
    await supabase
      .from('circuit_breaker_state')
      .update(updates)
      .eq('service_name', this.serviceName);
  }
}