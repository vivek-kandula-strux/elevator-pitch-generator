import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  name: string;
  whatsapp: string;
  company: string;
  category: string;
  usp: string;
  specificAsk: string;
}

interface BusinessFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}


export default function BusinessForm({ onSubmit, isLoading }: BusinessFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    whatsapp: '',
    company: '',
    category: '',
    usp: '',
    specificAsk: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.whatsapp)) {
      newErrors.whatsapp = 'Please enter a valid phone number';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Business category is required';
    }

    if (!formData.usp.trim()) {
      newErrors.usp = 'Unique Selling Point is required';
    }

    if (!formData.specificAsk.trim()) {
      newErrors.specificAsk = 'Please describe your target audience and goals';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      toast({
        title: "Form Submitted!",
        description: "Generating your elevator pitch...",
      });
      onSubmit(formData);
    } else {
      toast({
        variant: "destructive",
        title: "Please fix the errors",
        description: "Some required fields are missing or invalid.",
      });
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="form-card p-8 max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          30-Second Elevator Pitch Generator
        </h1>
        <p className="text-lg text-muted-foreground text-balance">
          Share your business details and get a compelling 30-second elevator pitch instantly
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              className={`form-input ${errors.name ? 'border-destructive focus:border-destructive' : ''}`}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          {/* WhatsApp Field */}
          <div>
            <label className="form-label">
              WhatsApp Number *
            </label>
            <input
              type="tel"
              className={`form-input ${errors.whatsapp ? 'border-destructive focus:border-destructive' : ''}`}
              placeholder="WhatsApp Number"
              value={formData.whatsapp}
              onChange={(e) => handleInputChange('whatsapp', e.target.value)}
              disabled={isLoading}
            />
            {errors.whatsapp && (
              <p className="text-sm text-destructive mt-1">{errors.whatsapp}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Field */}
          <div>
            <label className="form-label">
              Company Name *
            </label>
            <input
              type="text"
              className={`form-input ${errors.company ? 'border-destructive focus:border-destructive' : ''}`}
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              disabled={isLoading}
            />
            {errors.company && (
              <p className="text-sm text-destructive mt-1">{errors.company}</p>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label className="form-label">
              Business Category *
            </label>
            <input
              type="text"
              className={`form-input ${errors.category ? 'border-destructive focus:border-destructive' : ''}`}
              placeholder="e.g. Technology, Healthcare, FinTech, etc."
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              disabled={isLoading}
            />
            {errors.category && (
              <p className="text-sm text-destructive mt-1">{errors.category}</p>
            )}
          </div>
        </div>

        {/* USP Field */}
        <div>
          <label className="form-label">
            Unique Selling Point *
          </label>
          <textarea
            className={`form-input min-h-[100px] resize-y ${errors.usp ? 'border-destructive focus:border-destructive' : ''}`}
            value={formData.usp}
            onChange={(e) => handleInputChange('usp', e.target.value)}
            disabled={isLoading}
          />
          {errors.usp && (
            <p className="text-sm text-destructive mt-1">{errors.usp}</p>
          )}
        </div>

        {/* Specific Ask Field */}
        <div>
          <label className="form-label">
            Target Audience & Goals *
          </label>
          <textarea
            className={`form-input min-h-[100px] resize-y ${errors.specificAsk ? 'border-destructive focus:border-destructive' : ''}`}
            value={formData.specificAsk}
            onChange={(e) => handleInputChange('specificAsk', e.target.value)}
            disabled={isLoading}
          />
          {errors.specificAsk && (
            <p className="text-sm text-destructive mt-1">{errors.specificAsk}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full text-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                Generating...
              </span>
            ) : (
              'Generate My 30-Second Pitch'
            )}
          </button>
        </div>
      </form>

      <div className="text-center mt-6 text-sm text-muted-foreground space-y-2">
        <p>✓ Secure processing • ✓ No spam • ✓ Professional results</p>
        <p>Powered by <span className="text-primary font-medium">Strux Digital</span></p>
      </div>
    </div>
  );
}