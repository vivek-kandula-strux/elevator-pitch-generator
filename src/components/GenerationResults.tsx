import React from 'react';
import { Copy, RefreshCw, Clock, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Custom SVG Icon Components
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
  </svg>
);
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

  const createShareContent = () => {
    return `${primaryPitch}\n\n---\nMade by Strux Digital - 30 Second Generator (https://strux.work/30secs)`;
  };

  const handleShare = (platform: string) => {
    const shareContent = createShareContent();
    const encodedContent = encodeURIComponent(shareContent);
    const url = window.location.href;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedContent}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodedContent}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodedContent}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedContent}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareContent);
        toast({
          title: "Share content copied!",
          description: "The pitch with attribution has been copied to your clipboard."
        });
        break;
    }
  };

  return <div className="max-w-5xl mx-auto animate-fade-in">
      {/* First Fold - Main Pitch Display */}
      <div className="min-h-screen flex flex-col justify-center">
        <div className="glass-card rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-border"></div>
          
          {/* Ready to Use Status Badge */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-sm font-medium text-success">Ready to Use</span>
            </div>
          </div>
          
          {/* Your 30 Seconds is Ready Heading */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent tracking-tight">
              Your 30 Seconds is Ready
            </h1>
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
                  <blockquote className="text-base sm:text-lg md:text-xl leading-relaxed text-foreground font-medium relative">
                    <span className="text-2xl text-primary/30 absolute -top-1 -left-4">"</span>
                    {primaryPitch}
                    <span className="text-2xl text-primary/30 absolute -bottom-3 right-0">"</span>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <button onClick={handleCopy} className="btn-primary flex items-center justify-center gap-3 px-6 py-4 min-h-[44px] w-full sm:w-auto">
              <Copy className="w-5 h-5" />
              <span className="font-semibold">Copy Pitch</span>
            </button>
          </div>

          {/* Social Sharing Section */}
          <div className="text-center">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-3">Share your success</p>
              <div className="flex justify-center items-center gap-3 flex-wrap">
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-[#1DA1F2]/20 border border-secondary/20 hover:border-[#1DA1F2]/30 flex items-center justify-center transition-all duration-200 hover:scale-105 group"
                  title="Share on Twitter/X"
                >
                  <TwitterIcon />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-[#0077B5]/20 border border-secondary/20 hover:border-[#0077B5]/30 flex items-center justify-center transition-all duration-200 hover:scale-105 group"
                  title="Share on LinkedIn"
                >
                  <LinkedInIcon />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-[#1877F2]/20 border border-secondary/20 hover:border-[#1877F2]/30 flex items-center justify-center transition-all duration-200 hover:scale-105 group"
                  title="Share on Facebook"
                >
                  <FacebookIcon />
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-[#25D366]/20 border border-secondary/20 hover:border-[#25D366]/30 flex items-center justify-center transition-all duration-200 hover:scale-105 group"
                  title="Share on WhatsApp"
                >
                  <WhatsAppIcon />
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 flex items-center justify-center transition-all duration-200 hover:scale-105"
                  title="Copy with attribution"
                >
                  <Copy className="w-4 h-4 text-secondary" />
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Made by <span className="font-medium text-foreground">Strux Digital</span> - 30 Second Generator (<a href="https://strux.work/30secs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://strux.work/30secs</a>)
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center mt-8 mb-4">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">More helpful tips below</p>
          </div>
          <ChevronDown className="w-6 h-6 text-primary/60 animate-bounce" />
        </div>
      </div>

      {/* Second Fold - Additional Actions and Guidelines */}
      <div className="pb-10">
        {/* Generate New Pitch Button */}
        <div className="flex justify-center mb-8 md:mb-12">
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