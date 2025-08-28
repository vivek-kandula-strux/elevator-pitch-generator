import React from 'react';
import { Download, RefreshCw, Share2, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePitchVariations, calculatePitchLength } from '@/utils/elevatorPitchGenerator';

interface FormData {
  name: string;
  whatsapp: string;
  company: string;
  category: string;
  usp: string;
  specificAsk: string;
}

interface GenerationResultsProps {
  formData: FormData;
  onStartOver: () => void;
}

export default function GenerationResults({ formData, onStartOver }: GenerationResultsProps) {
  const { toast } = useToast();

  const pitchVariations = generatePitchVariations(formData);
  const primaryPitch = pitchVariations[0];
  const pitchLength = calculatePitchLength(primaryPitch);

  const handleDownload = () => {
    const content = generateTextContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.company}_elevator_pitch.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Complete!",
      description: "Your elevator pitch has been saved to your device.",
    });
  };

  const handleShare = () => {
    const shareText = `Just generated a custom 30-second elevator pitch for ${formData.company}! 🚀\n\n"${primaryPitch}"`;
    
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

  const generateTextContent = () => {
    let content = `30-Second Elevator Pitch for ${formData.company}\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    content += `Client Information:\n`;
    content += `Name: ${formData.name}\n`;
    content += `Company: ${formData.company}\n`;
    content += `Category: ${formData.category}\n`;
    content += `Contact: ${formData.whatsapp}\n\n`;
    content += `PRIMARY PITCH (${pitchLength} seconds):\n`;
    content += `${primaryPitch}\n\n`;
    content += `ALTERNATIVE VERSIONS:\n`;
    pitchVariations.slice(1).forEach((pitch, index) => {
      content += `Version ${index + 2}: ${pitch}\n\n`;
    });
    content += `USAGE TIPS:\n`;
    content += `• Practice your pitch until it flows naturally\n`;
    content += `• Adjust the pace to fit exactly 30 seconds\n`;
    content += `• Use confident body language and eye contact\n`;
    content += `• End with a clear call to action\n`;
    
    return content;
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
          Here's your compelling elevator pitch for {formData.company}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="form-card p-6 mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleDownload}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Results
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

      {/* Alternative Versions */}
      {pitchVariations.length > 1 && (
        <div className="form-card p-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Alternative Versions
          </h3>
          <div className="space-y-4">
            {pitchVariations.slice(1).map((pitch, index) => (
              <div key={index} className="border-l-4 border-secondary pl-4">
                <p className="text-muted-foreground leading-relaxed">
                  "{pitch}"
                </p>
                <span className="text-xs text-muted-foreground mt-2 block">
                  Version {index + 2} • ~{calculatePitchLength(pitch)} seconds
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="form-card p-6 mt-8 bg-primary-light">
        <h3 className="text-lg font-semibold text-primary mb-3">
          Practice Tips
        </h3>
        <p className="text-primary mb-4">
          Your pitch is ready! Contact: <strong>{formData.whatsapp}</strong>
        </p>
        <div className="text-sm text-primary/80 space-y-1">
          <p>• Practice until it flows naturally (aim for exactly 30 seconds)</p>
          <p>• Use confident body language and maintain eye contact</p>
          <p>• End with a clear question or call to action</p>
          <p>• Adjust the pace based on your speaking style</p>
        </div>
      </div>
    </div>
  );
}