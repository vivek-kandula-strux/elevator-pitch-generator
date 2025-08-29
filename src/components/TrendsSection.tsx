import { motion } from 'framer-motion';
import { TrendingUp, Lightbulb, Target, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const trends = [
  {
    icon: TrendingUp,
    title: "AI-Powered Attribution",
    description: "Advanced machine learning models now track customer journeys across 15+ touchpoints, providing unprecedented insight into what drives conversions.",
    impact: "35% improvement in budget allocation efficiency"
  },
  {
    icon: Target,
    title: "First-Party Data Strategies",
    description: "With third-party cookies declining, brands are building robust first-party data ecosystems through interactive content and progressive profiling.",
    impact: "2.5x higher engagement rates"
  },
  {
    icon: BarChart,
    title: "Performance Creative Testing",
    description: "Systematic creative testing frameworks using statistical significance are replacing gut-feel decisions in ad creative development.",
    impact: "50% faster creative optimization cycles"
  },
  {
    icon: Lightbulb,
    title: "Integrated Channel Orchestration",
    description: "Breaking down silos between paid, owned, and earned media to create cohesive customer experiences across all touchpoints.",
    impact: "40% increase in customer lifetime value"
  }
];

const insights = [
  {
    stat: "73%",
    label: "of marketers increased budgets for performance marketing in 2024"
  },
  {
    stat: "4.2x",
    label: "higher ROI achieved through integrated multi-channel campaigns"
  },
  {
    stat: "67%",
    label: "of consumers expect personalized experiences across all touchpoints"
  }
];

export const TrendsSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Navigating the Trends for Growth
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Digital marketing evolves rapidly. We stay ahead of industry shifts and emerging technologies 
            to ensure your strategies remain competitive and effective in an ever-changing landscape.
          </p>
        </motion.div>

        {/* Market Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {insights.map((insight, index) => (
            <div key={index} className="text-center bg-card/30 backdrop-blur-lg rounded-xl p-6 border border-primary/10">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {insight.stat}
              </div>
              <div className="text-muted-foreground font-medium">
                {insight.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Trends Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {trends.map((trend, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-lg border-primary/10 hover:border-primary/20 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-gradient-primary p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <trend.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl text-foreground">
                      {trend.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {trend.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm font-semibold text-primary">
                      {trend.impact}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Strategy CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 border border-primary/20"
        >
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Stay Ahead of the Curve
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Don't let your competition get ahead. Our team continuously researches, tests, and implements 
            the latest strategies to keep your marketing at the forefront of industry innovation.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">Weekly</div>
              <div className="text-sm text-muted-foreground">Strategy Updates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Performance Monitoring</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};