import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { Button } from '../ui/button';

const pricingTiers = [
  {
    name: "Starter",
    description: "Perfect for small businesses and startups",
    price: "2,500",
    period: "month",
    icon: Star,
    features: [
      "2-3 Service Categories",
      "Basic Analytics & Reporting",
      "Monthly Strategy Sessions",
      "Email Support",
      "Basic Brand Guidelines",
      "Social Media Management",
      "Content Creation (10 posts/month)"
    ],
    popular: false,
    color: "from-muted to-muted/50"
  },
  {
    name: "Growth",
    description: "Ideal for growing businesses seeking expansion",
    price: "5,500",
    period: "month",
    icon: Zap,
    features: [
      "5-7 Service Categories",
      "Advanced Analytics & Insights",
      "Bi-weekly Strategy Sessions",
      "Priority Support",
      "Complete Brand Strategy",
      "Multi-Platform Campaigns",
      "Content Creation (25 posts/month)",
      "Paid Advertising Management",
      "SEO Optimization",
      "Lead Generation Systems"
    ],
    popular: true,
    color: "from-primary to-secondary"
  },
  {
    name: "Enterprise",
    description: "Comprehensive solutions for large organizations",
    price: "Custom",
    period: "tailored",
    icon: Crown,
    features: [
      "All 14 Service Categories",
      "Real-time Dashboards",
      "Weekly Strategy Sessions",
      "Dedicated Account Manager",
      "Full Brand Transformation",
      "Omnichannel Campaigns",
      "Unlimited Content Creation",
      "Advanced Automation",
      "Custom Integrations",
      "Fractional Leadership",
      "24/7 Priority Support",
      "Performance Guarantees"
    ],
    popular: false,
    color: "from-secondary to-primary"
  }
];

export const PricingSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/10" />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
            <Crown className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Investment Plans</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Transparent Pricing
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              For Every Business
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan that scales with your business. No hidden fees, 
            no surprises—just clear value and measurable results.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative group ${
                tier.popular ? 'lg:scale-105 lg:-mt-4' : ''
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Card */}
              <div className={`relative p-8 rounded-3xl backdrop-blur-sm border transition-all duration-300 h-full ${
                tier.popular 
                  ? 'bg-card border-primary/30 shadow-lg shadow-primary/10' 
                  : 'bg-card/50 border-border/50 hover:border-primary/20'
              }`}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${tier.color} opacity-5`} />
                
                <div className="relative">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${tier.color} ${tier.popular ? 'opacity-20' : 'opacity-10'} flex items-center justify-center`}>
                      <tier.icon className={`w-8 h-8 ${tier.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
                    <p className="text-muted-foreground mb-6">{tier.description}</p>
                    
                    <div className="mb-6">
                      {tier.price === "Custom" ? (
                        <div className="text-4xl font-bold text-foreground">Custom</div>
                      ) : (
                        <div className="flex items-baseline justify-center">
                          <span className="text-sm text-muted-foreground">$</span>
                          <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                          <span className="text-muted-foreground ml-1">/{tier.period}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      tier.popular
                        ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-primary/25'
                        : 'bg-muted hover:bg-muted/80 text-foreground hover:text-primary border border-border/50 hover:border-primary/30'
                    }`}
                  >
                    {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16 pt-16 border-t border-border/50"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Need a custom solution? Let's discuss your specific requirements.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4 rounded-2xl border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
          >
            Schedule Consultation
          </Button>
        </motion.div>
      </div>
    </section>
  );
};