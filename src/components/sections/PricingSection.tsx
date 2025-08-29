import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { Button } from '../ui/button';
const pricingTiers = [{
  name: "Starter",
  description: "Perfect for small businesses and startups",
  price: "2,500",
  period: "month",
  icon: Star,
  features: ["2-3 Service Categories", "Basic Analytics & Reporting", "Monthly Strategy Sessions", "Email Support", "Basic Brand Guidelines", "Social Media Management", "Content Creation (10 posts/month)"],
  popular: false,
  color: "from-muted to-muted/50"
}, {
  name: "Growth",
  description: "Ideal for growing businesses seeking expansion",
  price: "5,500",
  period: "month",
  icon: Zap,
  features: ["5-7 Service Categories", "Advanced Analytics & Insights", "Bi-weekly Strategy Sessions", "Priority Support", "Complete Brand Strategy", "Multi-Platform Campaigns", "Content Creation (25 posts/month)", "Paid Advertising Management", "SEO Optimization", "Lead Generation Systems"],
  popular: true,
  color: "from-primary to-secondary"
}, {
  name: "Enterprise",
  description: "Comprehensive solutions for large organizations",
  price: "Custom",
  period: "tailored",
  icon: Crown,
  features: ["All 14 Service Categories", "Real-time Dashboards", "Weekly Strategy Sessions", "Dedicated Account Manager", "Full Brand Transformation", "Omnichannel Campaigns", "Unlimited Content Creation", "Advanced Automation", "Custom Integrations", "Fractional Leadership", "24/7 Priority Support", "Performance Guarantees"],
  popular: false,
  color: "from-secondary to-primary"
}];
export const PricingSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Investment Plans
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan to accelerate your business growth with our comprehensive digital marketing solutions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-background rounded-2xl border ${
                  tier.popular 
                    ? 'border-primary shadow-2xl shadow-primary/20 scale-105' 
                    : 'border-border shadow-lg'
                } p-8 h-full`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${tier.color} mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground mb-4">{tier.description}</p>
                  <div className="flex items-baseline justify-center gap-2">
                    {tier.price !== "Custom" ? (
                      <>
                        <span className="text-4xl font-bold">${tier.price}</span>
                        <span className="text-muted-foreground">/{tier.period}</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold">{tier.price}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    tier.popular 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  size="lg"
                >
                  {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};