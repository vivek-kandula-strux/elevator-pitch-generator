import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceModal } from '../components/ServiceModal';
import { RequirementForm } from '../components/RequirementForm';
import { services } from '../data/services';
import { Service } from '../types/services';
import { Button } from '../components/ui/button';

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };

  const handleRequirementClick = () => {
    setIsModalOpen(false);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Generator
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-lg font-semibold text-foreground">Digital Marketing Services</h1>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Digital Marketing
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                That Delivers Results
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore our comprehensive suite of digital marketing services, each backed by proven case studies and measurable results. Click on any service to see how we've helped businesses like yours achieve their goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={handleServiceSelect}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Scale Your Business?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Don't see exactly what you're looking for? Every business is unique, and we create custom strategies tailored to your specific needs and goals.
            </p>
            <Button
              onClick={() => setIsFormOpen(true)}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              Discuss Your Requirements
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      <ServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onRequirementClick={handleRequirementClick}
      />
      
      <RequirementForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        preSelectedService={selectedService?.id}
      />
    </div>
  );
};

export default ServicesPage;