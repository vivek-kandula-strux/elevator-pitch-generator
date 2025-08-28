import React from 'react';
import { Copy, RefreshCw, Share2, CheckCircle, Clock } from 'lucide-react';
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

export default function GenerationResults({ formData, generationData, onStartOver }: GenerationResultsProps) {
  const { toast } = useToast();

  const primaryPitch = generationData.generatedPitch;
  const pitchLength = calculatePitchLength(primaryPitch);

  function calculatePitchLength(pitch: string): number {
    // Average speaking pace is about 150 words per minute
    // For a 30-second pitch, that's roughly 75 words
    const words = pitch.split(' ').length;
    const estimatedSeconds = Math.round((words / 150) * 60);
    return estimatedSeconds;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(primaryPitch);
    toast({
      title: "Copied to clipboard!",
      description: "Your elevator pitch has been copied to your clipboard.",
    });
  };

  const handleShare = () => {
    const shareText = `Just generated a custom 30-second elevator pitch for ${generationData.company}! 🚀\n\n"${primaryPitch}"`;
    
    if (navigator.share) {
      navigator.share({
        title: '30-Second Elevator Pitch Generator',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard!",
        description: "Your elevator pitch has been copied to your clipboard.",
      });
    }
  };


  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Success Header */}
      <div className="form-card p-8 mb-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-success" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Your 30-Second Elevator Pitch is Ready! 🎉
        </h1>
        <p className="text-lg text-muted-foreground">
          Here's your AI-generated elevator pitch for {generationData.company}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="form-card p-6 mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleCopy}
            className="btn-primary flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Pitch
          </button>
          <button
            onClick={handleShare}
            className="btn-secondary flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={onStartOver}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Generate New Pitch
          </button>
        </div>
      </div>

      {/* Primary Pitch */}
      <div className="form-card p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Your Primary Pitch
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            ~{pitchLength} seconds
          </div>
        </div>
        
        <div className="bg-primary-light rounded-lg p-6 mb-6">
          <p className="text-lg leading-relaxed text-primary font-medium">
            "{primaryPitch}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Optimized for 30 seconds</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Highlights your USP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Clear call to action</span>
          </div>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="form-card p-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          How to Use Your Pitch
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Practice Tips:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Read it aloud and time yourself</li>
              <li>• Practice until it flows naturally</li>
              <li>• Adjust pace to hit exactly 30 seconds</li>
              <li>• Use confident body language</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">When to Use:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Networking events</li>
              <li>• Business meetings</li>
              <li>• Investor presentations</li>
              <li>• Social introductions</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}