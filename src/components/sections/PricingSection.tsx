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
  return;
};