import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGTMTracking } from '@/hooks/useGTMTracking';
import { useDebounce } from '@/hooks/useDebounce';
import { sanitizeFormData, validatePhone, validateRequired } from '@/utils/inputSanitizer';
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
const BusinessForm = React.memo(function BusinessForm({
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
  const { toast } = useToast();
  const { trackFormStart, trackFormStep, trackFormError, trackFormSubmission } = useGTMTracking();

  // Debounced form data for validation
  const debouncedFormData = useDebounce(formData, 300);

  // Track form start when component mounts
  useEffect(() => {
    trackFormStart('business_form');
  }, [trackFormStart]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!validateRequired(formData.name)) {
      newErrors.name = 'Name is required';
    }
    if (!validateRequired(formData.whatsapp)) {
      newErrors.whatsapp = 'WhatsApp number is required';
    } else if (!validatePhone(formData.whatsapp)) {
      newErrors.whatsapp = 'Please enter a valid phone number';
    }
    if (!validateRequired(formData.company)) {
      newErrors.company = 'Company name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Business category is required';
    }
    if (!validateRequired(formData.usp)) {
      newErrors.usp = 'Unique Selling Point is required';
    }
    if (!validateRequired(formData.specificAsk)) {
      newErrors.specificAsk = 'Please describe your target audience and goals';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Sanitize form data before submission
      const sanitizedData = sanitizeFormData(formData) as FormData;
      
      trackFormSubmission('business_form', {
        company: sanitizedData.company,
        category: sanitizedData.category,
        form_step: 'completed'
      });
      onSubmit(sanitizedData);
    } else {
      const errorFields = Object.keys(errors).join(', ');
      trackFormError('business_form', `Validation failed: ${errorFields}`);
      toast({
        variant: "destructive",
        title: "Please fix the errors",
        description: "Some required fields are missing or invalid."
      });
    }
  }, [validateForm, trackFormSubmission, formData, errors, trackFormError, toast, onSubmit]);
  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Track form progress
    if (field === 'company' && value.length > 2) {
      trackFormStep('business_form', 'company_entered');
    } else if (field === 'category' && value.length > 2) {
      trackFormStep('business_form', 'category_entered');
    } else if (field === 'usp' && value.length > 10) {
      trackFormStep('business_form', 'usp_entered');
    }
    
    // Clear error when user starts typing using functional update
    setErrors(prev => {
      if (prev[field]) {
        return {
          ...prev,
          [field]: ''
        };
      }
      return prev;
    });
  }, [trackFormStep]);
  return <div className="form-card p-4 md:p-6 lg:p-10 max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-4 h-4 rounded-full bg-success animate-blink-online"></div>
          <div className="text-sm font-medium text-primary-ultra tracking-wide uppercase">
            Strux Digital Presents
          </div>
        </div>
        <h1 className="font-bold text-foreground mb-4 tracking-tight text-5xl">
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            30 Second Generator
          </span>
        </h1>
        <p className="text-balance max-w-2xl mx-auto font-medium text-red-50 text-sm">
          Transform your business story into a compelling 30-second pitch that opens doors and creates opportunities
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Name Field */}
          <div className="space-y-3 py-0 my-0">
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
                <span className="text-center text-sm font-bold">Generate my 30-Seconds</span>
                
              </span>}
          </button>
        </div>
      </form>

      <div className="text-center mt-8 space-y-4">
        
        <p className="text-sm text-muted-foreground">
          Powered by <span className="text-primary font-semibold bg-gradient-primary bg-clip-text text-transparent">Strux Digital</span>
        </p>
      </div>
    </div>;
});

export default BusinessForm;