import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

const faqs = [
  {
    question: "How quickly can we see results from your services?",
    answer: "While every business is unique, most clients see initial improvements within 30-45 days. Significant growth typically occurs within 3-6 months as our strategies mature and optimize. We provide detailed weekly reports so you can track progress every step of the way."
  },
  {
    question: "What makes your approach different from other agencies?",
    answer: "We focus on data-driven strategies with proven methodologies, not just creative campaigns. Our team includes specialists across 14 service categories, allowing us to create integrated solutions. Plus, we guarantee transparent reporting and maintain a 98% client retention rate."
  },
  {
    question: "Do you work with businesses in my industry?",
    answer: "We work across virtually all industries - from SaaS and e-commerce to healthcare, professional services, and consumer brands. Our diverse team has deep experience in sector-specific strategies and compliance requirements."
  },
  {
    question: "What's included in your content creation services?",
    answer: "Our content services include social media posts, blog articles, video content, graphic design, email campaigns, and paid advertising creatives. All content is tailored to your brand voice and optimized for each platform's best practices."
  },
  {
    question: "How do you measure and report on campaign performance?",
    answer: "We use advanced analytics tools to track key metrics like ROI, conversion rates, engagement, and attribution. You'll receive detailed weekly reports plus access to a real-time dashboard. Monthly strategy calls review performance and optimize for better results."
  },
  {
    question: "Can you work with our existing marketing team?",
    answer: "Absolutely! We often complement in-house teams by filling skill gaps or providing specialized expertise. We can work as an extension of your team or provide fractional leadership to guide your marketing strategy."
  },
  {
    question: "What if we need to pause or modify our services?",
    answer: "We offer flexible contracts with 30-day notice periods. Services can be scaled up or down based on your needs, and we work with you to find solutions that fit your budget and goals. Our goal is long-term partnership, not vendor lock-in."
  },
  {
    question: "Do you provide training for our internal team?",
    answer: "Yes! We offer training sessions, workshops, and knowledge transfer to help your team understand best practices. This includes platform training, strategy workshops, and ongoing consultation to build your internal capabilities."
  }
];

export const FAQSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about our services, processes, and what you can expect when working with us.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card/50 backdrop-blur-lg rounded-xl border border-primary/10 px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Still Have Questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our team is here to help. Schedule a free consultation to discuss your specific needs and get personalized answers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@struxdigital.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-primary text-primary-foreground font-semibold rounded-xl hover:shadow-primary/25 transition-all duration-300"
              >
                Email Us Directly
              </a>
              <a
                href="tel:+1-555-0123"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary/20 text-primary hover:bg-primary/10 font-semibold rounded-xl transition-all duration-300"
              >
                Call: (555) 123-4567
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};