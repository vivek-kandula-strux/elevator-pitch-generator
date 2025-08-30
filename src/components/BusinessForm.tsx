import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGTMTracking } from '@/hooks/useGTMTracking';
import { useDebouncedInput } from '@/hooks/useDebounce';

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

const BusinessForm = React.memo(({
  onSubmit,
  isLoading
}: BusinessFormProps) => {
  // Debounced inputs for better performance
  const nameInput = useDebouncedInput('', 300);
  const whatsappInput = useDebouncedInput('', 300);
  const companyInput = useDebouncedInput('', 300);
  const categoryInput = useDebouncedInput('', 300);
  const uspInput = useDebouncedInput('', 300);
  const specificAskInput = useDebouncedInput('', 300);

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const { toast } = useToast();
  const { trackFormStart, trackFormStep, trackFormError, trackFormSubmission } = useGTMTracking();

  // Memoize form data object to prevent unnecessary re-renders
  const formData = useMemo(() => ({
    name: nameInput.debouncedValue,
    whatsapp: whatsappInput.debouncedValue,
    company: companyInput.debouncedValue,
    category: categoryInput.debouncedValue,
    usp: uspInput.debouncedValue,
    specificAsk: specificAskInput.debouncedValue
  }), [
    nameInput.debouncedValue,
    whatsappInput.debouncedValue,
    companyInput.debouncedValue,
    categoryInput.debouncedValue,
    uspInput.debouncedValue,
    specificAskInput.debouncedValue
  ]);

  // Track form start when component mounts
  useEffect(() => {
    trackFormStart('business_form');
  }, [trackFormStart]);

  // Memoized validation function
  const validateForm = useCallback((): boolean => {
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
  }, [formData]);

  // Memoized submit handler
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      trackFormSubmission('business_form', {
        company: formData.company,
        category: formData.category,
        form_step: 'completed'
      });
      onSubmit(formData);
    } else {
      const errorFields = Object.keys(errors).join(', ');
      trackFormError('business_form', `Validation failed: ${errorFields}`);
      toast({
        variant: "destructive",
        title: "Please fix the errors",
        description: "Some required fields are missing or invalid."
      });
    }
  }, [formData, validateForm, errors, trackFormSubmission, trackFormError, onSubmit, toast]);

  // Memoized input change handlers
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    nameInput.handleChange(e.target.value);
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  }, [nameInput.handleChange, errors.name]);

  const handleWhatsappChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    whatsappInput.handleChange(e.target.value);
    if (errors.whatsapp) {
      setErrors(prev => ({ ...prev, whatsapp: '' }));
    }
  }, [whatsappInput.handleChange, errors.whatsapp]);

  const handleCompanyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    companyInput.handleChange(value);
    
    // Track form progress
    if (value.length > 2) {
      trackFormStep('business_form', 'company_entered');
    }
    
    if (errors.company) {
      setErrors(prev => ({ ...prev, company: '' }));
    }
  }, [companyInput.handleChange, trackFormStep, errors.company]);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    categoryInput.handleChange(value);
    
    // Track form progress
    if (value.length > 2) {
      trackFormStep('business_form', 'category_entered');
    }
    
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  }, [categoryInput.handleChange, trackFormStep, errors.category]);

  const handleUspChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    uspInput.handleChange(value);
    
    // Track form progress
    if (value.length > 10) {
      trackFormStep('business_form', 'usp_entered');
    }
    
    if (errors.usp) {
      setErrors(prev => ({ ...prev, usp: '' }));
    }
  }, [uspInput.handleChange, trackFormStep, errors.usp]);

  const handleSpecificAskChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    specificAskInput.handleChange(e.target.value);
    if (errors.specificAsk) {
      setErrors(prev => ({ ...prev, specificAsk: '' }));
    }
  }, [specificAskInput.handleChange, errors.specificAsk]);

  // Memoized error messages
  const errorMessages = useMemo(() => ({
    name: errors.name,
    whatsapp: errors.whatsapp,
    company: errors.company,
    category: errors.category,
    usp: errors.usp,
    specificAsk: errors.specificAsk
  }), [errors]);

  return (
    <div className="form-card p-4 md:p-6 lg:p-10 max-w-3xl mx-auto animate-fade-in">
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
            <input 
              type="text" 
              className={`form-input ${errorMessages.name ? 'border-destructive focus:border-destructive' : ''}`} 
              value={nameInput.value} 
              onChange={handleNameChange} 
              disabled={isLoading} 
            />
            {errorMessages.name && (
              <p className="text-sm text-destructive mt-2 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center text-xs">!</span>
                {errorMessages.name}
              </p>
            )}
          </div>

          {/* WhatsApp Field */}
          <div className="space-y-3">
            <label className="form-label">
              WhatsApp Number *
            </label>
            <input 
              type="tel" 
              className={`form-input ${errorMessages.whatsapp ? 'border-destructive focus:border-destructive' : ''}`} 
              value={whatsappInput.value} 
              onChange={handleWhatsappChange} 
              disabled={isLoading} 
            />
            {errorMessages.whatsapp && (
              <p className="text-sm text-destructive mt-2 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center text-xs">!</span>
                {errorMessages.whatsapp}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Field */}
          <div className="space-y-3">
            <label className="form-label">
              Company Name *
            </label>
            <input 
              type="text" 
              className={`form-input ${errorMessages.company ? 'border-destructive focus:border-destructive' : ''}`} 
              value={companyInput.value} 
              onChange={handleCompanyChange} 
              disabled={isLoading} 
            />
            {errorMessages.company && (
              <p className="text-sm text-destructive mt-2 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center text-xs">!</span>
                {errorMessages.company}
              </p>
            )}
          </div>

          {/* Category Field */}
          <div className="space-y-3">
            <label className="form-label">
              Business Category *
            </label>
            <input 
              type="text" 
              className={`form-input ${errorMessages.category ? 'border-destructive focus:border-destructive' : ''}`} 
              value={categoryInput.value} 
              onChange={handleCategoryChange} 
              disabled={isLoading} 
            />
            {errorMessages.category && (
              <p className="text-sm text-destructive mt-2 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center text-xs">!</span>
                {errorMessages.category}
              </p>
            )}
          </div>
        </div>

        {/* USP Field */}
        <div className="space-y-3">
          <label className="form-label">
            Unique Selling Point *
          </label>
          <div className="relative">
            <textarea 
              className={`form-input min-h-[120px] resize-none ${errorMessages.usp ? 'border-destructive focus:border-destructive' : ''}`} 
              value={uspInput.value} 
              onChange={handleUspChange} 
              disabled={isLoading} 
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {uspInput.value.length}/200
            </div>
          </div>
          {errorMessages.usp && (
            <p className="text-sm text-destructive mt-2 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center text-xs">!</span>
              {errorMessages.usp}
            </p>
          )}
        </div>

        {/* Specific Ask Field */}
        <div className="space-y-3">
          <label className="form-label">My Specific ask *</label>
          <div className="relative">
            <textarea 
              className={`form-input min-h-[120px] resize-none ${errorMessages.specificAsk ? 'border-destructive focus:border-destructive' : ''}`} 
              value={specificAskInput.value} 
              onChange={handleSpecificAskChange} 
              disabled={isLoading} 
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {specificAskInput.value.length}/300
            </div>
          </div>
          {errorMessages.specificAsk && (
            <p className="text-sm text-destructive mt-2 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center text-xs">!</span>
              {errorMessages.specificAsk}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button type="submit" disabled={isLoading} className="btn-primary w-full text-lg relative group">
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                <span className="font-semibold">Generating Your Pitch...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <span className="text-center text-sm font-bold">Generate my 30-Seconds</span>
              </span>
            )}
          </button>
        </div>
      </form>

      <div className="text-center mt-8 space-y-4">
        <p className="text-sm text-muted-foreground">
          Powered by <span className="text-primary font-semibold bg-gradient-primary bg-clip-text text-transparent">Strux Digital</span>
        </p>
      </div>
    </div>
  );
});

BusinessForm.displayName = 'BusinessForm';

export default BusinessForm;