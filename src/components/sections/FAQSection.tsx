import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: "What makes Strux Digital different from other agencies?",
    answer: "We offer 14 specialized service categories under one roof, eliminating the need for multiple vendors. Our data-driven approach ensures every strategy is backed by analytics, and our team of 25+ specialists brings deep expertise across all digital marketing disciplines."
  },
  {
    question: "How do you measure success and ROI?",
    answer: "We establish clear KPIs and benchmarks at the project start, using advanced analytics tools to track performance in real-time. Our clients receive detailed monthly reports showing ROI, conversion rates, traffic growth, and other relevant metrics specific to their goals."
  },
  {
    question: "What's included in your service packages?",
    answer: "Each package includes strategy development, implementation, ongoing optimization, and regular reporting. Starter includes 2-3 service categories, Growth covers 5-7 categories, and Enterprise provides access to all 14 categories with dedicated account management."
  },
  {
    question: "How quickly can we expect to see results?",
    answer: "Timeline varies by service type. SEO and content marketing typically show results in 3-6 months, while paid advertising and social media can generate immediate traffic. We provide realistic timelines during our initial consultation based on your specific goals."
  },
  {
    question: "Do you work with businesses of all sizes?",
    answer: "Yes, we scale our services from startups to enterprise organizations. Our three-tier pricing structure ensures we can provide value whether you're a small business just starting out or a large corporation looking to optimize existing campaigns."
  },
  {
    question: "What industries do you specialize in?",
    answer: "We work across multiple industries including SaaS, e-commerce, healthcare, real estate, professional services, and B2B technology. Our diverse team brings experience from various sectors to provide relevant, industry-specific strategies."
  },
  {
    question: "Can we customize services based on our specific needs?",
    answer: "Absolutely. While we offer structured packages, we often customize service combinations based on unique business requirements. Our Enterprise package is fully tailored, and we're happy to discuss custom solutions for any size business."
  },
  {
    question: "What kind of support and communication can we expect?",
    answer: "All clients receive dedicated support with varying levels based on their package. This includes regular strategy sessions, email/phone support, detailed reporting, and for Enterprise clients, a dedicated account manager for ongoing consultation."
  }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/10 to-background" />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
      
      <div className="relative max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
            <HelpCircle className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">FAQ</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Frequently Asked
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get answers to the most common questions about our services, 
            processes, and how we can help transform your business.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 transition-opacity duration-300 ${
                  openIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                }`} />
                
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="relative w-full text-left p-6 focus:outline-none"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown 
                      className={`w-5 h-5 text-muted-foreground group-hover:text-primary transition-all duration-300 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                
                {/* Answer */}
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? 'auto' : 0,
                    paddingBottom: openIndex === index ? 24 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden"
                >
                  <div className="px-6">
                    <div className="border-t border-border/30 pt-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16 pt-16 border-t border-border/50"
        >
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Still have questions?
          </h3>
          <p className="text-muted-foreground mb-6">
            Our team is here to help. Schedule a consultation to discuss your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25">
              Schedule Consultation
            </button>
            <button className="px-6 py-3 rounded-2xl border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all duration-300">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};