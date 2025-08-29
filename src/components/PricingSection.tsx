import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const pricingTiers = [
  {
    name: "Starter",
    price: "2,500",
    period: "month",
    description: "Perfect for small businesses starting their digital journey",
    features: [
      "Social Media Management (2 platforms)",
      "Content Creation (12 posts/month)",
      "Basic Analytics & Reporting",
      "Email Support",
      "Monthly Strategy Call"
    ],
    popular: false,
    color: "border-border"
  },
  {
    name: "Growth",
    price: "5,500",
    period: "month",
    description: "Ideal for growing businesses ready to scale",
    features: [
      "Multi-Platform Management (4 platforms)",
      "Content Creation (24 posts/month)",
      "Paid Advertising Management",
      "Advanced Analytics & BI Dashboard",
      "Weekly Strategy Calls",
      "Creative Design Services",
      "Email Marketing Campaigns"
    ],
    popular: true,
    color: "border-primary"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "month",
    description: "Complete digital marketing ecosystem for large organizations",
    features: [
      "Full-Service Digital Marketing",
      "Dedicated Account Team",
      "Custom Content Production",
      "Advanced Attribution Modeling",
      "Daily Support & Optimization",
      "Fractional CMO Services",
      "Custom Integrations & Reporting"
    ],
    popular: false,
    color: "border-border"
  }
];

interface PricingSectionProps {
  onGetStarted: () => void;
}

export const PricingSection = ({ onGetStarted }: PricingSectionProps) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            No hidden fees, no surprises. Choose the plan that fits your business goals and scale as you grow.
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium text-primary">💰 30-Day Money-Back Guarantee</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <Card className={`h-full ${tier.color} ${tier.popular ? 'ring-2 ring-primary/20' : ''} bg-card/50 backdrop-blur-lg hover:shadow-lg transition-all duration-300`}>
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    {tier.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">
                      {tier.price === "Custom" ? tier.price : `$${tier.price}`}
                    </span>
                    {tier.price !== "Custom" && (
                      <span className="text-muted-foreground">/{tier.period}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {tier.description}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={onGetStarted}
                    className={`w-full ${
                      tier.popular 
                        ? 'bg-gradient-primary text-primary-foreground hover:shadow-primary/25' 
                        : 'bg-card hover:bg-muted border border-primary/20 text-foreground'
                    } transition-all duration-300`}
                    size="lg"
                  >
                    {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20"
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Need Something Different?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Every business is unique. We create custom solutions tailored to your specific needs, industry, and growth objectives. Let's discuss what works best for you.
          </p>
          <Button
            onClick={onGetStarted}
            variant="outline"
            size="lg"
            className="border-primary/30 hover:bg-primary/10 text-primary"
          >
            Schedule Custom Consultation
          </Button>
        </motion.div>
      </div>
    </section>
  );
};