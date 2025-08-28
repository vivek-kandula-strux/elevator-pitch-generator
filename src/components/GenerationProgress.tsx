import React, { useState, useEffect } from 'react';

interface GenerationProgressProps {
  onComplete: () => void;
}

export default function GenerationProgress({ onComplete }: GenerationProgressProps) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        const newProgress = ((30 - newTime) / 30) * 100;
        setProgress(newProgress);
        
        if (newTime <= 0) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Small delay for effect
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  const getStatusMessage = () => {
    if (timeLeft > 25) return "Analyzing your business information...";
    if (timeLeft > 20) return "Understanding your unique value proposition...";
    if (timeLeft > 15) return "Crafting personalized content strategy...";
    if (timeLeft > 10) return "Generating high-quality content...";
    if (timeLeft > 5) return "Finalizing and optimizing results...";
    if (timeLeft > 0) return "Almost ready! Preparing your content...";
    return "Complete! Your content is ready.";
  };

  return (
    <div className="form-card p-12 max-w-2xl mx-auto text-center animate-scale-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Generating Your Content
        </h2>
        <p className="text-lg text-muted-foreground">
          Our AI is creating personalized content for your business
        </p>
      </div>

      {/* Countdown Display */}
      <div className="mb-8">
        <div className="countdown-display">
          {timeLeft}
        </div>
        <p className="text-lg text-muted-foreground mt-2">seconds remaining</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-primary transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {Math.round(progress)}% complete
        </p>
      </div>

      {/* Status Messages */}
      <div className="bg-primary-light rounded-lg p-6 mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-primary">PROCESSING</span>
        </div>
        <p className="text-primary text-balance font-medium">
          {getStatusMessage()}
        </p>
      </div>

      {/* Features List */}
      <div className="text-left">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
          What you'll receive:
        </h3>
        <div className="space-y-3">
          {[
            'Personalized content tailored to your business',
            'Professional copy that reflects your unique value',
            'Ready-to-use materials for immediate implementation',
            'Content optimized for your target audience'
          ].map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}