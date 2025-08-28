import React from 'react';
import { Download, RefreshCw, Share2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const generatedContent = {
    title: `Custom Content for ${formData.company}`,
    sections: [
      {
        title: "Executive Summary",
        content: `${formData.company} operates in the ${formData.category.toLowerCase()} sector, distinguished by their unique approach: ${formData.usp}. Our analysis reveals significant opportunities for content optimization tailored to their specific requirements.`
      },
      {
        title: "Key Value Propositions",
        content: [
          `✓ Industry Leadership: Established presence in ${formData.category}`,
          `✓ Unique Advantage: ${formData.usp}`,
          `✓ Professional Excellence: Commitment to quality and innovation`,
          `✓ Customer Focus: Tailored solutions for optimal results`
        ]
      },
      {
        title: "Content Strategy Recommendations",
        content: `Based on your request for "${formData.specificAsk}", we recommend a multi-channel approach that highlights your unique positioning while addressing your target audience's core needs. The content should emphasize your distinctive value proposition while maintaining professional credibility.`
      },
      {
        title: "Implementation Guidelines",
        content: [
          "Deploy content across primary marketing channels",
          "Maintain consistent brand voice and messaging",
          "Monitor engagement metrics and adjust accordingly",
          "Schedule regular content updates and refreshes"
        ]
      }
    ]
  };

  const handleDownload = () => {
    const content = generateTextContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.company}_content_strategy.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Complete!",
      description: "Your content strategy has been saved to your device.",
    });
  };

  const handleShare = () => {
    const shareText = `Just generated a custom content strategy for ${formData.company} using the 30-Second Generator! 🚀`;
    
    if (navigator.share) {
      navigator.share({
        title: '30-Second Generator Results',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard!",
        description: "Share text has been copied to your clipboard.",
      });
    }
  };

  const generateTextContent = () => {
    let content = `${generatedContent.title}\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    content += `Client Information:\n`;
    content += `Name: ${formData.name}\n`;
    content += `Company: ${formData.company}\n`;
    content += `Category: ${formData.category}\n`;
    content += `Contact: ${formData.whatsapp}\n\n`;
    
    generatedContent.sections.forEach(section => {
      content += `${section.title}\n`;
      content += `${'='.repeat(section.title.length)}\n`;
      if (Array.isArray(section.content)) {
        section.content.forEach(item => {
          content += `${item}\n`;
        });
      } else {
        content += `${section.content}\n`;
      }
      content += '\n';
    });
    
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
          Content Generated Successfully! 🎉
        </h1>
        <p className="text-lg text-muted-foreground">
          Your personalized content strategy is ready for {formData.company}
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
            Generate New Content
          </button>
        </div>
      </div>

      {/* Generated Content */}
      <div className="form-card p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {generatedContent.title}
        </h2>
        
        <div className="space-y-8">
          {generatedContent.sections.map((section, index) => (
            <div key={index} className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {section.title}
              </h3>
              <div className="text-muted-foreground">
                {Array.isArray(section.content) ? (
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="leading-relaxed">
                    {section.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="form-card p-6 mt-8 bg-primary-light">
        <h3 className="text-lg font-semibold text-primary mb-3">
          Next Steps
        </h3>
        <p className="text-primary mb-4">
          We'll send a detailed copy to your WhatsApp number: <strong>{formData.whatsapp}</strong>
        </p>
        <div className="text-sm text-primary/80 space-y-1">
          <p>• Implementation support available</p>
          <p>• Questions? Contact us via WhatsApp</p>
          <p>• Generated content is ready for immediate use</p>
        </div>
      </div>
    </div>
  );
}