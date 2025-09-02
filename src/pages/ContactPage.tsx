import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { RequirementFormData } from '@/types/services';
import { serviceCategories } from '@/data/serviceCategories';
import { useSubmitRequirement } from '@/hooks/useOptimizedQueries';
import { useToast } from '@/hooks/use-toast';
import { useGTMTracking } from '@/hooks/useGTMTracking';
import { getPhoneErrorMessage, formatPhoneInput } from '@/utils/phoneValidation';
import Header from '@/components/Header';

const ContactPage = () => {
  const { toast } = useToast();
  const { trackFormStart, trackFormSubmission, trackRequirementSubmission, trackFormError } = useGTMTracking();
  
  // Use optimized mutation
  const submitRequirementMutation = useSubmitRequirement();
  
  const [formData, setFormData] = useState<RequirementFormData>({
    name: '',
    email: '',
    company: '',
    whatsapp: '',
    serviceType: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<RequirementFormData>>({});

  // Track form start on page load
  useEffect(() => {
    trackFormStart('requirement_form');
  }, [trackFormStart]);

  const validateForm = (): boolean => {
    const newErrors: Partial<RequirementFormData> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp is required';
    else {
      const phoneError = getPhoneErrorMessage(formData.whatsapp);
      if (phoneError) {
        newErrors.whatsapp = phoneError;
      }
    }
    if (!formData.serviceType) newErrors.serviceType = 'Please select a service';
    if (!formData.message.trim()) newErrors.message = 'Requirements are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const errorFields = Object.keys(errors).join(', ');
      trackFormError('requirement_form', `Validation failed: ${errorFields}`);
      return;
    }
    
    try {
      // Track form submission
      trackFormSubmission('requirement_form', {
        service_category: formData.serviceType,
        company: formData.company,
        form_step: 'completed'
      });

      // Use optimized mutation
      await submitRequirementMutation.mutateAsync(formData);

      // Track successful requirement submission
      trackRequirementSubmission(formData.serviceType);

      toast({
        title: "Requirement submitted successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      setIsSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ 
          name: '', 
          email: '', 
          company: '',
          whatsapp: '',
          serviceType: '', 
          message: '' 
        });
        setErrors({});
      }, 5000);

    } catch (error) {
      console.error('Error submitting requirement:', error);
      toast({
        title: "Error submitting requirement",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      {/* Main Content */}
      <div className="pt-24 pb-16 relative overflow-hidden">
        {/* Background Enhancement */}
        <div className="absolute inset-0 bg-gradient-glow opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12 fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 glow-text">
                Get Started Today
              </h1>
              <p className="text-xl text-muted-foreground">
                Tell us about your project needs and we'll get back to you within 24 hours.
              </p>
            </div>

            {/* Form Card */}
            <Card className="form-card p-8 scale-in">
              {!isSubmitted ? (
                <>
                  <CardHeader className="p-0 mb-8">
                    <CardTitle className="text-2xl font-bold text-foreground">
                      Project Requirements
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Fill out the form below and our team will contact you soon.
                    </CardDescription>
                  </CardHeader>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="form-label">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className={`form-input ${errors.name ? 'border-destructive' : ''}`}
                          placeholder="Your name"
                        />
                        {errors.name && (
                          <p className="text-destructive text-sm mt-2">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email" className="form-label">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className={`form-input ${errors.email ? 'border-destructive' : ''}`}
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="text-destructive text-sm mt-2">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company" className="form-label">
                          Company *
                        </Label>
                        <Input
                          id="company"
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                          className={`form-input ${errors.company ? 'border-destructive' : ''}`}
                          placeholder="Your company"
                        />
                        {errors.company && (
                          <p className="text-destructive text-sm mt-2">{errors.company}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="whatsapp" className="form-label">
                          WhatsApp *
                        </Label>
                        <Input
                          id="whatsapp"
                          type="tel"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                          className={`form-input ${errors.whatsapp ? 'border-destructive' : ''}`}
                          placeholder="+1 555 123 4567"
                        />
                        {errors.whatsapp && (
                          <p className="text-destructive text-sm mt-2">{errors.whatsapp}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="serviceType" className="form-label">
                        Service Type *
                      </Label>
                      <Select
                        value={formData.serviceType}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, serviceType: value }))}
                      >
                        <SelectTrigger className={`form-input ${errors.serviceType ? 'border-destructive' : ''}`}>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.icon} {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.serviceType && (
                        <p className="text-destructive text-sm mt-2">{errors.serviceType}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="message" className="form-label">
                        Project Requirements *
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className={`form-input min-h-[120px] resize-none ${errors.message ? 'border-destructive' : ''}`}
                        placeholder="Describe your project needs, goals, timeline, and any specific requirements..."
                        rows={5}
                      />
                      {errors.message && (
                        <p className="text-destructive text-sm mt-2">{errors.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={submitRequirementMutation.isPending}
                      className="btn-primary w-full"
                    >
                      {submitRequirementMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="progress-ring w-4 h-4"></div>
                          Submitting...
                        </div>
                      ) : (
                        'Submit Requirements'
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    Thank You!
                  </CardTitle>
                  <CardDescription className="text-lg">
                    We've received your requirements and will contact you within 24 hours.
                  </CardDescription>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;