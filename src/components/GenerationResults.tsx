import React from 'react';
import { Copy, RefreshCw, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface FormData {
  name: string;
  whatsapp: string;
  company: string;
  category: string;
  usp: string;
  specificAsk: string;
}
interface GenerationData extends FormData {
  generatedPitch: string;
  recordId: string;
}
interface GenerationResultsProps {
  formData: FormData | null;
  generationData: GenerationData;
  onStartOver: () => void;
}
export default function GenerationResults({
  formData,
  generationData,
  onStartOver
}: GenerationResultsProps) {
  const { toast } = useToast();
  const primaryPitch = generationData.generatedPitch;
  const pitchLength = calculatePitchLength(primaryPitch);
  function calculatePitchLength(pitch: string): number {
    // Average speaking pace is about 150 words per minute
    // For a 30-second pitch, that's roughly 75 words
    const words = pitch.split(' ').length;
    const estimatedSeconds = Math.round(words / 150 * 60);
    return estimatedSeconds;
  }
  const handleCopy = () => {
    navigator.clipboard.writeText(primaryPitch);
    toast({
      title: "Copied to clipboard!",
      description: "Your elevator pitch has been copied to your clipboard."
    });
  };

  return <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center animate-pulse-glow">
            <span className="text-2xl">🎉</span>
          </div>
          <div className="text-sm font-medium text-success tracking-wide uppercase">
            Generation Complete
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
          Your Elevator Pitch is{' '}
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Ready!
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Here's your professionally crafted 30-second elevator pitch, optimized for maximum impact
        </p>
      </div>

      {/* Main Pitch Display */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 mb-6 md:mb-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-border"></div>
        
        {/* Ready to Use Status Badge */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-sm font-medium text-success">Ready to Use</span>
          </div>
        </div>
        
        <div className="bg-gradient-glass rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 border border-card-border/30 relative">
          <div className="absolute inset-0 bg-gradient-glow opacity-20 pointer-events-none"></div>
          
          <div className="flex items-center justify-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Estimated Duration
                </span>
                <div className="text-lg font-bold text-primary">
                  {calculatePitchLength(primaryPitch)} seconds
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative h-32 sm:h-40">
            <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-primary rounded-full"></div>
            <div className="pl-6 h-full overflow-hidden">
              <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20">
                <blockquote className="text-sm sm:text-base leading-relaxed text-foreground font-medium relative">
                  <span className="text-2xl text-primary/30 absolute -top-1 -left-4">"</span>
                  {primaryPitch}
                  <span className="text-2xl text-primary/30 absolute -bottom-3 right-0">"</span>
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6 md:mb-8">
          <button onClick={handleCopy} className="btn-primary flex items-center justify-center gap-3 px-6 py-4 min-h-[44px] w-full sm:w-auto">
            <Copy className="w-5 h-5" />
            <span className="font-semibold">Copy Pitch</span>
          </button>
        </div>

        {/* Generate New Pitch Button */}
        <div className="flex justify-center mb-6 md:mb-8">
          <button onClick={onStartOver} className="btn-secondary flex items-center justify-center gap-3 px-6 py-4 min-h-[44px] w-full sm:w-auto">
            <RefreshCw className="w-5 h-5" />
            <span className="font-medium">Generate New Pitch</span>
          </button>
        </div>

        {/* Enhanced Usage Guidelines */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-border"></div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
              <span className="text-xl">💡</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground">Maximize Your Pitch Impact</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Practice Out Loud</h4>
                  <p className="text-sm text-muted-foreground">Time yourself and adjust pacing for natural delivery</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Adapt to Your Audience</h4>
                  <p className="text-sm text-muted-foreground">Emphasize different aspects based on who you're speaking with</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">End with Engagement</h4>
                  <p className="text-sm text-muted-foreground">Ask a question to start meaningful conversations</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-secondary">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Stay Authentic</h4>
                  <p className="text-sm text-muted-foreground">Let your genuine passion and enthusiasm shine through</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-secondary">5</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Keep It Conversational</h4>
                  <p className="text-sm text-muted-foreground">Avoid sounding rehearsed or overly formal</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-secondary">6</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Follow Up</h4>
                  <p className="text-sm text-muted-foreground">Always have a clear next step or call-to-action ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}