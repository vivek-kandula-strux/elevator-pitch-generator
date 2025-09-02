import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatTimestampIST } from "@/utils/timezone";

interface SyncResult {
  success: boolean;
  message: string;
  timestamp: string;
  details?: any;
}

export const GoogleSheetsDebug = () => {
  const [elevatorPitchesLoading, setElevatorPitchesLoading] = useState(false);
  const [requirementsLoading, setRequirementsLoading] = useState(false);
  const [elevatorPitchesResult, setElevatorPitchesResult] = useState<SyncResult | null>(null);
  const [requirementsResult, setRequirementsResult] = useState<SyncResult | null>(null);
  const { toast } = useToast();

  const syncElevatorPitches = async () => {
    setElevatorPitchesLoading(true);
    setElevatorPitchesResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('sync-to-google-sheets');
      
      const result: SyncResult = {
        success: !error,
        message: error ? error.message : 'Elevator pitches synced successfully',
        timestamp: formatTimestampIST(new Date()),
        details: data || error
      };
      
      setElevatorPitchesResult(result);
      
      if (error) {
        toast({
          title: "Sync Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sync Successful",
          description: "Elevator pitches synced to Google Sheets",
        });
      }
    } catch (err: any) {
      const result: SyncResult = {
        success: false,
        message: err.message || 'Unknown error occurred',
        timestamp: formatTimestampIST(new Date()),
        details: err
      };
      
      setElevatorPitchesResult(result);
      toast({
        title: "Sync Error",
        description: err.message || 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setElevatorPitchesLoading(false);
    }
  };

  const syncRequirements = async () => {
    setRequirementsLoading(true);
    setRequirementsResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('sync-requirements-to-google-sheets');
      
      const result: SyncResult = {
        success: !error,
        message: error ? error.message : 'Requirements synced successfully',
        timestamp: formatTimestampIST(new Date()),
        details: data || error
      };
      
      setRequirementsResult(result);
      
      if (error) {
        toast({
          title: "Sync Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sync Successful",
          description: "Requirements synced to Google Sheets",
        });
      }
    } catch (err: any) {
      const result: SyncResult = {
        success: false,
        message: err.message || 'Unknown error occurred',
        timestamp: formatTimestampIST(new Date()),
        details: err
      };
      
      setRequirementsResult(result);
      toast({
        title: "Sync Error",
        description: err.message || 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setRequirementsLoading(false);
    }
  };

  const ResultCard = ({ title, result, loading }: { title: string; result: SyncResult | null; loading: boolean }) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {!loading && result && (result.success ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />)}
          {title}
        </CardTitle>
        {result && (
          <CardDescription>
            Last sync: {result.timestamp}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">{result.message}</p>
                {result.details && (
                  <details className="text-sm">
                    <summary className="cursor-pointer font-medium">View Details</summary>
                    <pre className="mt-2 whitespace-pre-wrap bg-muted p-2 rounded text-xs overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
        {loading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Syncing...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Google Sheets Sync Debug</h1>
        <p className="text-muted-foreground">
          Test the Google Sheets synchronization functions and view real-time results
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Elevator Pitches Sync</CardTitle>
            <CardDescription>
              Sync elevator pitches data to the "ElevatorPitches" sheet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={syncElevatorPitches} 
              disabled={elevatorPitchesLoading}
              className="w-full"
            >
              {elevatorPitchesLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Elevator Pitches
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements Sync</CardTitle>
            <CardDescription>
              Sync requirements data to the "Requirements" sheet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={syncRequirements} 
              disabled={requirementsLoading}
              className="w-full"
            >
              {requirementsLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Requirements
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Sync Results</h2>
        <div className="space-y-4">
          <ResultCard 
            title="Elevator Pitches Sync Result" 
            result={elevatorPitchesResult} 
            loading={elevatorPitchesLoading} 
          />
          <ResultCard 
            title="Requirements Sync Result" 
            result={requirementsResult} 
            loading={requirementsLoading} 
          />
        </div>
      </div>

      <Alert>
        <AlertDescription>
          <strong>Setup checklist:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>✓ GOOGLE_SHEETS_CLIENT_EMAIL secret configured</li>
            <li>✓ GOOGLE_SHEETS_PRIVATE_KEY secret configured</li>
            <li>✓ GOOGLE_SHEET_ID secret configured</li>
            <li>• Share your Google Sheet with the service account email as Editor</li>
            <li>• Ensure your Google Sheet has "ElevatorPitches" and "Requirements" tabs</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};