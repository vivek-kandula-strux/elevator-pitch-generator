import { motion } from 'framer-motion';
import { Target, TrendingUp, Users, Zap, CheckCircle, Globe, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

const benefits = [
  {
    icon: Target,
    title: "Holistic Approach",
    description: "Comprehensive strategies that integrate all aspects of digital marketing for maximum impact."
  },
  {
    icon: TrendingUp,
    title: "Data-Driven Results",
    description: "Every decision backed by analytics and measurable outcomes with proven ROI."
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "25+ specialized professionals across 14 service categories with proven methodologies."
  },
  {
    icon: Zap,
    title: "Rapid Execution",
    description: "Swift implementation with agile methodologies that deliver results faster."
  }
];

const achievements = [
  "150+ successful campaigns launched",
  "4.9/5 average client satisfaction rating", 
  "99% project completion rate",
  "85+ businesses transformed digitally"
];

const metrics = [
  { label: "Revenue Growth", value: "+285%", color: "text-primary" },
  { label: "Lead Generation", value: "+420%", color: "text-secondary" },
  { label: "Brand Awareness", value: "+340%", color: "text-primary" },
  { label: "Customer Retention", value: "+190%", color: "text-secondary" }
];

export const SocialProofSection = () => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-1/2 left-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-3xl opacity-50" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Why Choose Strux Digital</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Experience The Benefits Of Our
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Expertise & Results
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We don't just deliver services—we deliver transformation through data-driven strategies 
            that combine creativity, insights, and cutting-edge technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 group-hover:bg-card/80 h-full">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                        <benefit.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        {benefit.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Achievements List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8 space-y-3"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{achievement}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Metrics Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative p-8 rounded-2xl bg-card border border-border/50 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/5 opacity-80" />
              
              <div className="relative space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Growth Metrics</h3>
                  <p className="text-muted-foreground">Real results from real campaigns</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {metrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center p-4 rounded-xl bg-background/50 border border-border/30"
                    >
                      <div className={`text-2xl font-bold ${metric.color} mb-1`}>
                        {metric.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {metric.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center pt-4">
                  <Button
                    size="lg"
                    className="group px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-xl"
                  >
                    View Case Studies
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-primary/20 animate-pulse" />
            <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-full bg-secondary/20 animate-pulse delay-1000" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};