import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Globe, Rocket } from 'lucide-react';
import { Button } from '../ui/button';

const achievements = [
  "150+ successful campaigns launched",
  "4.9/5 average client satisfaction rating",
  "99% project completion rate",
  "85+ businesses transformed digitally"
];

export const ValuePropositionSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-1/2 left-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-secondary/10 rounded-full blur-2xl opacity-50" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
              <Globe className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Industry Leadership</span>
            </div>
            
            {/* Main Headline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              We Drive Businesses To The
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Forefront Of Industries
              </span>
            </h2>
            
            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              Through comprehensive digital marketing strategies that combine creativity, 
              data-driven insights, and cutting-edge technology, we transform businesses 
              into industry leaders.
            </p>

            {/* Achievements List */}
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{achievement}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="group px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-2xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                Discover Our Process
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative p-8 rounded-3xl bg-card border border-border/50 backdrop-blur-sm">
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/5 opacity-80" />
              
              {/* Content */}
              <div className="relative space-y-8">
                {/* Header */}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Growth Metrics</h3>
                  <p className="text-muted-foreground">Real results from real campaigns</p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "Revenue Growth", value: "+285%", color: "text-primary" },
                    { label: "Lead Generation", value: "+420%", color: "text-secondary" },
                    { label: "Brand Awareness", value: "+340%", color: "text-primary" },
                    { label: "Customer Retention", value: "+190%", color: "text-secondary" }
                  ].map((metric, index) => (
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
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-secondary/20 animate-pulse delay-1000" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};