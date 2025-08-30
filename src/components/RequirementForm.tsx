import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, CheckCircle, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RequirementFormData } from '../types/services';
import { serviceCategories } from '../data/serviceCategories';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import { useGTMTracking } from '../hooks/useGTMTracking';
import { useDebouncedInput } from '../hooks/useDebounce';

interface RequirementFormProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedService?: string;
}

const RequirementForm = React.memo(({ isOpen, onClose, preSelectedService }: RequirementFormProps) => {
  const { toast } = useToast();
  const { trackFormStart, trackFormSubmission, trackRequirementSubmission, trackFormError } = useGTMTracking();
  
  // Debounced inputs for better performance
  const nameInput = useDebouncedInput('', 300);
  const emailInput = useDebouncedInput('', 300);
  const companyInput = useDebouncedInput('', 300);
  const whatsappInput = useDebouncedInput('', 300);
  const messageInput = useDebouncedInput('', 300);
  
  const [serviceType, setServiceType] = useState(preSelectedService || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<RequirementFormData>>({});

  // Memoize form data object to prevent unnecessary re-renders
  const formData = useMemo(() => ({
    name: nameInput.debouncedValue,
    email: emailInput.debouncedValue,
    company: companyInput.debouncedValue,
    whatsapp: whatsappInput.debouncedValue,
    serviceType,
    message: messageInput.debouncedValue
  }), [
    nameInput.debouncedValue,
    emailInput.debouncedValue,
    companyInput.debouncedValue,
    whatsappInput.debouncedValue,
    serviceType,
    messageInput.debouncedValue
  ]);

  // Track form start when modal opens
  useEffect(() => {
    if (isOpen) {
      trackFormStart('requirement_form');
    }
  }, [isOpen, trackFormStart]);

  // Update service type when preSelectedService changes
  useEffect(() => {
    if (preSelectedService) {
      setServiceType(preSelectedService);
    }
  }, [preSelectedService]);

  // Memoized validation function
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<RequirementFormData> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp is required';
    else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.whatsapp.replace(/\s/g, ''))) {
      newErrors.whatsapp = 'Please enter a valid WhatsApp number';
    }
    if (!formData.serviceType) newErrors.serviceType = 'Please select a service';
    if (!formData.message.trim()) newErrors.message = 'Requirements are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Memoized submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const errorFields = Object.keys(errors).join(', ');
      trackFormError('requirement_form', `Validation failed: ${errorFields}`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Track form submission
      trackFormSubmission('requirement_form', {
        service_category: formData.serviceType,
        company: formData.company,
        form_step: 'completed'
      });

      // Store data in requirements table
      const { error } = await supabase
        .from('requirements')
        .insert({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          whatsapp: formData.whatsapp,
          service_type: formData.serviceType,
          message: formData.message
        });

      if (error) throw error;

      // Sync to Google Sheets (non-blocking)
      try {
        await supabase.functions.invoke('sync-requirements-to-google-sheets');
        console.log('Requirements synced to Google Sheets');
      } catch (syncError) {
        console.error('Google Sheets sync failed:', syncError);
        // Continue with email notification even if sync fails
      }

      // Send email notification
      try {
        await supabase.functions.invoke('send-requirement-notification', {
          body: {
            name: formData.name,
            email: formData.email,
            company: formData.company,
            whatsapp: formData.whatsapp,
            serviceType: formData.serviceType,
            message: formData.message
          }
        });
        console.log('Email notification sent successfully');
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the whole submission if email fails
      }

      // Track successful requirement submission
      trackRequirementSubmission(formData.serviceType);

      toast({
        title: "Requirement submitted successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        nameInput.setValue('');
        emailInput.setValue('');
        companyInput.setValue('');
        whatsappInput.setValue('');
        messageInput.setValue('');
        setServiceType(preSelectedService || '');
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Error submitting requirement:', error);
      toast({
        title: "Error submitting requirement",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, errors, trackFormSubmission, trackFormError, trackRequirementSubmission, toast, nameInput, emailInput, companyInput, whatsappInput, messageInput, preSelectedService, onClose]);

  // Memoized close handler
  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      nameInput.setValue('');
      emailInput.setValue('');
      companyInput.setValue('');
      whatsappInput.setValue('');
      messageInput.setValue('');
      setServiceType(preSelectedService || '');
      setErrors({});
      setIsSubmitted(false);
      onClose();
    }
  }, [isSubmitting, nameInput, emailInput, companyInput, whatsappInput, messageInput, preSelectedService, onClose]);

  // Memoized input change handlers
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    nameInput.handleChange(e.target.value);
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  }, [nameInput.handleChange, errors.name]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    emailInput.handleChange(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  }, [emailInput.handleChange, errors.email]);

  const handleCompanyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    companyInput.handleChange(e.target.value);
    if (errors.company) {
      setErrors(prev => ({ ...prev, company: undefined }));
    }
  }, [companyInput.handleChange, errors.company]);

  const handleWhatsappChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    whatsappInput.handleChange(e.target.value);
    if (errors.whatsapp) {
      setErrors(prev => ({ ...prev, whatsapp: undefined }));
    }
  }, [whatsappInput.handleChange, errors.whatsapp]);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    messageInput.handleChange(e.target.value);
    if (errors.message) {
      setErrors(prev => ({ ...prev, message: undefined }));
    }
  }, [messageInput.handleChange, errors.message]);

  const handleServiceTypeChange = useCallback((value: string) => {
    setServiceType(value);
    if (errors.serviceType) {
      setErrors(prev => ({ ...prev, serviceType: undefined }));
    }
  }, [errors.serviceType]);

  // Memoized click handlers
  const handleBackdropClick = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Memoized service options
  const serviceOptions = useMemo(() => 
    serviceCategories.map((category) => (
      <SelectItem key={category.id} value={category.id}>
        {category.icon} {category.title}
      </SelectItem>
    )), []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl"
            onClick={handleModalClick}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background border border-border hover:border-primary/20 transition-colors duration-200 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-4 sm:p-6">
              {!isSubmitted ? (
                <>
                  {/* Header */}
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      Get Started
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Tell us about your project needs
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={nameInput.value}
                        onChange={handleNameChange}
                        className={errors.name ? 'border-destructive' : ''}
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive mt-1">{errors.name}</p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={emailInput.value}
                        onChange={handleEmailChange}
                        className={errors.email ? 'border-destructive' : ''}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">{errors.email}</p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        type="text"
                        value={companyInput.value}
                        onChange={handleCompanyChange}
                        className={errors.company ? 'border-destructive' : ''}
                        placeholder="Your company"
                      />
                      {errors.company && (
                        <p className="text-sm text-destructive mt-1">{errors.company}</p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <Label htmlFor="whatsapp">WhatsApp *</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        value={whatsappInput.value}
                        onChange={handleWhatsappChange}
                        className={errors.whatsapp ? 'border-destructive' : ''}
                        placeholder="+1 555 123 4567"
                      />
                      {errors.whatsapp && (
                        <p className="text-sm text-destructive mt-1">{errors.whatsapp}</p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="serviceType">Service *</Label>
                      <Select
                        value={serviceType}
                        onValueChange={handleServiceTypeChange}
                      >
                        <SelectTrigger className={errors.serviceType ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceOptions}
                        </SelectContent>
                      </Select>
                      {errors.serviceType && (
                        <p className="text-sm text-destructive mt-1">{errors.serviceType}</p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <Label htmlFor="message">Requirements *</Label>
                      <Textarea
                        id="message"
                        value={messageInput.value}
                        onChange={handleMessageChange}
                        className={errors.message ? 'border-destructive' : ''}
                        placeholder="Describe your project needs..."
                        rows={3}
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive mt-1">{errors.message}</p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Submitting...
                          </div>
                        ) : (
                          'Get Quote'
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Thank You!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We'll contact you within 24 hours.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

RequirementForm.displayName = 'RequirementForm';

export { RequirementForm };