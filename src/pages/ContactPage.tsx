import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Header from '@/components/Header';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate form submission - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      
      reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Send Message",
        description: "Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
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
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16 fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 glow-text">
                Get In Touch
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Ready to elevate your business? Let's discuss how we can help you achieve your digital marketing goals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Contact Information */}
              <div className="space-y-8 slide-up">
                <Card className="glass-card border-card-border p-8">
                  <CardHeader className="p-0 mb-8">
                    <CardTitle className="text-2xl font-bold text-foreground mb-2">
                      Let's Start a Conversation
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-lg">
                      We're here to help your business grow with tailored digital marketing solutions.
                    </CardDescription>
                  </CardHeader>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                        <p className="text-muted-foreground">hello@struxdigital.com</p>
                        <p className="text-sm text-muted-foreground">We typically respond within 2 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Call Us</h3>
                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                        <p className="text-sm text-muted-foreground">Mon-Fri, 9 AM - 6 PM EST</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Visit Us</h3>
                        <p className="text-muted-foreground">123 Business District</p>
                        <p className="text-muted-foreground">New York, NY 10001</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quick Stats */}
                <Card className="glass-card border-card-border p-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary mb-1">24h</div>
                      <div className="text-sm text-muted-foreground">Response Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-secondary mb-1">500+</div>
                      <div className="text-sm text-muted-foreground">Happy Clients</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Contact Form */}
              <Card className="form-card p-8 scale-in">
                <CardHeader className="p-0 mb-8">
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Send Us a Message
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="form-label">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        {...register('name')}
                        className="form-input"
                        placeholder="Your full name"
                      />
                      {errors.name && (
                        <p className="text-destructive text-sm mt-2">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="form-label">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="form-input"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm mt-2">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company" className="form-label">
                      Company (Optional)
                    </Label>
                    <Input
                      id="company"
                      {...register('company')}
                      className="form-input"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="form-label">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      {...register('subject')}
                      className="form-input"
                      placeholder="What can we help you with?"
                    />
                    {errors.subject && (
                      <p className="text-destructive text-sm mt-2">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message" className="form-label">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      className="form-input min-h-[120px] resize-none"
                      placeholder="Tell us about your project and goals..."
                    />
                    {errors.message && (
                      <p className="text-destructive text-sm mt-2">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <div className="progress-ring w-4 h-4"></div>
                      ) : (
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      )}
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </span>
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;