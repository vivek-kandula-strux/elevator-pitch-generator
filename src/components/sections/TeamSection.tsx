import { motion } from 'framer-motion';
import { Users, Award, Target, Lightbulb } from 'lucide-react';

const teamStats = [
  { icon: Users, value: "25+", label: "Expert Professionals" },
  { icon: Award, value: "8+", label: "Years Experience" },
  { icon: Target, value: "150+", label: "Projects Completed" },
  { icon: Lightbulb, value: "14", label: "Service Categories" }
];

const teamMembers = [
  {
    name: "Marketing Strategists",
    description: "Data-driven professionals who craft comprehensive strategies that deliver measurable results across all digital channels.",
    count: "8 Specialists"
  },
  {
    name: "Creative Professionals",
    description: "Award-winning designers and content creators who bring your brand vision to life with compelling visual storytelling.",
    count: "6 Creatives"
  },
  {
    name: "Technical Experts",
    description: "Full-stack developers and automation specialists who build scalable solutions that grow with your business.",
    count: "5 Developers"
  },
  {
    name: "Analytics Team",
    description: "Performance specialists who track, analyze, and optimize every aspect of your digital marketing campaigns.",
    count: "4 Analysts"
  }
];

export const TeamSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-background" />
      <div className="absolute top-1/4 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-1/4 h-1/4 bg-secondary/5 rounded-full blur-2xl" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Our Team</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            The People Behind
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              The Magic
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our diverse team of specialists brings together creativity, technical expertise, 
            and strategic thinking to deliver exceptional results for every client.
          </p>
        </motion.div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {teamStats.map((stat, index) => (
            <div key={index} className="text-center group">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300"
              >
                <stat.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </motion.div>
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Team Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 group-hover:bg-card/80 h-full">
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {member.name}
                    </h3>
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                      <span className="text-sm font-medium text-primary">{member.count}</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
                </div>

                {/* Decorative Element */}
                <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary/40 transition-colors duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary/10 border border-secondary/20 mb-8">
            <Award className="w-5 h-5 text-secondary" />
            <span className="font-medium text-secondary">Trusted By Businesses Like Yours</span>
          </div>
          
          {/* Client Logos Placeholder */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="w-24 h-12 rounded-lg bg-gradient-to-r from-muted/30 to-muted/50 flex items-center justify-center"
              >
                <div className="w-16 h-6 bg-muted-foreground/20 rounded" />
              </div>
            ))}
          </div>
          
          <p className="text-muted-foreground mt-8 max-w-2xl mx-auto">
            Join the growing list of businesses that have transformed their digital presence 
            with our expert team and proven strategies.
          </p>
        </motion.div>
      </div>
    </section>
  );
};