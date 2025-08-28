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
export default function BusinessForm({
  onSubmit,
  isLoading
}: BusinessFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    whatsapp: '',
    company: '',
    category: '',
    usp: '',
    specificAsk: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const {
    toast
  } = useToast();
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
        description: "Generating your elevator pitch..."
      });
      onSubmit(formData);
    } else {
      toast({
        variant: "destructive",
        title: "Please fix the errors",
        description: "Some required fields are missing or invalid."
      });
    }
  };
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  return <div className="form-card p-4 md:p-6 lg:p-10 max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-8">
          <div className="w-4 h-4 rounded-full bg-gradient-primary animate-pulse-glow"></div>
          <div className="text-lg font-bold text-primary-ultra tracking-wide uppercase">
            Strux Digital Presents
          </div>
          <div className="w-4 h-4 rounded-full bg-gradient-primary animate-pulse-glow"></div>
        </div>
        <h1 className="text-5xl font-bold text-foreground mb-4 tracking-tight">
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            30 Second Generator
          </span>
        </h1>
        <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto font-medium">
          Transform your business story into a compelling 30-second pitch that opens doors and creates opportunities
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Name Field */}
          <div className="space-y-3">
            <label className="form-label">
              Full Name *
            </label>
            <input type="text" className={`form-input ${errors.name ? 'border-destructive focus:border-destructive' : ''}`} value={formData.name} onChange={e => handleInputChange('name', e.target.value)} disabled={isLoading} />
            {errors.name && <p className="text-sm text-destructive mt-2 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center text-xs">!</span>
                {errors.name}
              </p>}
          </div>

          {/* WhatsApp Field */}
          <div className="space-y-3">
            <label className="form-label">
              WhatsApp Number *
            </label>
            <input type="tel" className={`form-input ${errors.whatsapp ? 'border-destructive focus:border-destructive' : ''}`} value={formData.whatsapp} onChange={e => handleInputChange('whatsapp', e.target.value)} disabled={isLoading} />
            {errors.whatsapp && <p className="text-sm text-destructive mt-2 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center text-xs">!</span>
                {errors.whatsapp}
              </p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Field */}
          <div className="space-y-3">
            <label className="form-label">
              Company Name *
            </label>
            <input type="text" className={`form-input ${errors.company ? 'border-destructive focus:border-destructive' : ''}`} value={formData.company} onChange={e => handleInputChange('company', e.target.value)} disabled={isLoading} />
            {errors.company && <p className="text-sm text-destructive mt-2 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center text-xs">!</span>
                {errors.company}
              </p>}
          </div>

          {/* Category Field */}
          <div className="space-y-3">
            <label className="form-label">
              Business Category *
            </label>
            <input type="text" className={`form-input ${errors.category ? 'border-destructive focus:border-destructive' : ''}`} value={formData.category} onChange={e => handleInputChange('category', e.target.value)} disabled={isLoading} />
            {errors.category && <p className="text-sm text-destructive mt-2 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center text-xs">!</span>
                {errors.category}
              </p>}
          </div>
        </div>

        {/* USP Field */}
        <div className="space-y-3">
          <label className="form-label">
            Unique Selling Point *
          </label>
          <div className="relative">
            <textarea className={`form-input min-h-[120px] resize-none ${errors.usp ? 'border-destructive focus:border-destructive' : ''}`} value={formData.usp} onChange={e => handleInputChange('usp', e.target.value)} disabled={isLoading} />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {formData.usp.length}/200
            </div>
          </div>
          {errors.usp && <p className="text-sm text-destructive mt-2 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center text-xs">!</span>
              {errors.usp}
            </p>}
        </div>

        {/* Specific Ask Field */}
        <div className="space-y-3">
          <label className="form-label">My Specific ask *</label>
          <div className="relative">
            <textarea className={`form-input min-h-[120px] resize-none ${errors.specificAsk ? 'border-destructive focus:border-destructive' : ''}`} value={formData.specificAsk} onChange={e => handleInputChange('specificAsk', e.target.value)} disabled={isLoading} />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {formData.specificAsk.length}/300
            </div>
          </div>
          {errors.specificAsk && <p className="text-sm text-destructive mt-2 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center text-xs">!</span>
              {errors.specificAsk}
            </p>}
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button type="submit" disabled={isLoading} className="btn-primary w-full text-lg relative group">
            {isLoading ? <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                <span className="font-semibold">Generating Your Pitch...</span>
              </span> : <span className="flex items-center justify-center gap-3">
                <span className="font-semibold">Generate my 30-Seconds</span>
                
              </span>}
          </button>
        </div>
      </form>

      <div className="text-center mt-8 space-y-4">
        <div className="glass-card rounded-xl p-4 max-w-md mx-auto">
          <p className="text-sm text-muted-foreground mb-2">
            Powered by
          </p>
          <div className="text-xl font-bold">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Strux Digital</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            AI-Powered Business Solutions
          </p>
        </div>
      </div>
    </div>;
}