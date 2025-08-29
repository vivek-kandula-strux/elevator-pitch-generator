import { motion } from 'framer-motion';
import { Award, Users, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const achievements = [
  {
    icon: Award,
    title: "Industry Recognition",
    description: "Top 1% Digital Marketing Agency by Forbes, with multiple industry awards for innovation and results."
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "50+ certified specialists across paid media, creative, analytics, and strategy with 10+ years average experience."
  },
  {
    icon: TrendingUp,
    title: "Proven Results",
    description: "Generated over $50M in attributable revenue for clients with an average 300% ROI across all campaigns."
  },
  {
    icon: Zap,
    title: "Cutting-Edge Tech",
    description: "Proprietary attribution models and AI-powered optimization tools that deliver competitive advantages."
  }
];

const teamStats = [
  { number: "50+", label: "Expert Specialists" },
  { number: "500+", label: "Successful Projects" },
  { number: "15+", label: "Years Experience" },
  { number: "98%", label: "Client Satisfaction" }
];

export const TeamSection = () => {
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
            The Power Behind Our Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our results speak through our people. Meet the certified experts, proven methodologies, 
            and cutting-edge technology that drive exceptional outcomes for every client.
          </p>
        </motion.div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {teamStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-lg border-primary/10 hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-primary p-3 rounded-xl">
                      <achievement.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {achievement.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Founder Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 border border-primary/20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Founded by Industry Veterans
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our leadership team combines 15+ years of experience from top-tier agencies and Fortune 500 companies. 
                We've scaled marketing operations for startups to enterprise, understanding the unique challenges 
                at every stage of growth.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">Former Google & Meta marketing leads</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">$100M+ in managed advertising spend</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">Published thought leaders in digital marketing</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-lg rounded-2xl p-6 border border-primary/20">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">500+</div>
                  <div className="text-foreground font-semibold mb-1">Brands Scaled</div>
                  <div className="text-sm text-muted-foreground">Across 25+ Industries</div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold">
                Award Winning
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card/80 backdrop-blur-lg border border-primary/20 px-4 py-2 rounded-xl text-sm font-semibold text-foreground">
                Certified Experts
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};