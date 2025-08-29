import { motion } from 'framer-motion';

// Mock client logos data - using popular company names with simple SVG designs
const clientLogos = [
  { name: "Microsoft", id: 1 },
  { name: "Apple", id: 2 },
  { name: "Google", id: 3 },
  { name: "Amazon", id: 4 },
  { name: "Meta", id: 5 },
  { name: "Netflix", id: 6 },
  { name: "Spotify", id: 7 },
  { name: "Adobe", id: 8 },
  { name: "Tesla", id: 9 },
  { name: "Uber", id: 10 },
  { name: "Airbnb", id: 11 },
  { name: "Shopify", id: 12 },
  { name: "Stripe", id: 13 },
  { name: "Slack", id: 14 },
  { name: "Zoom", id: 15 },
  { name: "Dropbox", id: 16 },
];

// Simple SVG logo component that creates a stylized company logo
const LogoSVG = ({ name, className }: { name: string; className?: string }) => {
  const initial = name.charAt(0);
  const colors = [
    'hsl(210 100% 55%)', // primary
    'hsl(260 75% 65%)', // secondary 
    'hsl(148 70% 55%)', // success
    'hsl(38 92% 55%)', // warning
  ];
  const color = colors[name.length % colors.length];

  return (
    <svg
      viewBox="0 0 120 40"
      className={`w-28 h-10 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background pill */}
      <rect
        x="0"
        y="8"
        width="120"
        height="24"
        rx="12"
        fill="currentColor"
        opacity="0.1"
      />
      
      {/* Company initial circle */}
      <circle
        cx="20"
        cy="20"
        r="10"
        fill={color}
        opacity="0.8"
      />
      
      {/* Company initial text */}
      <text
        x="20"
        y="25"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="white"
      >
        {initial}
      </text>
      
      {/* Company name */}
      <text
        x="38"
        y="24"
        fontSize="11"
        fontWeight="500"
        fill="currentColor"
        opacity="0.8"
      >
        {name}
      </text>
    </svg>
  );
};

export const ClientLogoSlider = () => {
  // Create duplicated arrays for infinite scroll effect
  const firstRowLogos = [...clientLogos.slice(0, 8), ...clientLogos.slice(0, 8)];
  const secondRowLogos = [...clientLogos.slice(8), ...clientLogos.slice(8)];

  return (
    <section className="py-12 lg:py-16 bg-muted/20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-glow opacity-20 pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 lg:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 lg:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Trusted by Industry Leaders
          </h2>
          <p className="text-sm lg:text-base text-muted-foreground max-w-2xl mx-auto">
            Join thousands of successful businesses that have transformed their digital presence with our solutions.
          </p>
        </motion.div>

        {/* Logo slider container */}
        <div className="relative">
          {/* First row - left to right */}
          <div className="flex overflow-hidden mb-4 lg:mb-6 relative" style={{
            WebkitMask: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            mask: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}>
            <motion.div
              className="flex gap-8 items-center"
              animate={{
                x: [0, -50 + '%']
              }}
              transition={{
                duration: 25,
                ease: "linear",
                repeat: Infinity
              }}
            >
              {firstRowLogos.map((logo, index) => (
                <motion.div
                  key={`${logo.id}-${index}`}
                  className="flex-shrink-0 group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  title={logo.name}
                >
                  <div className="glass-card p-4 rounded-xl transition-all duration-300 group-hover:shadow-primary/20">
                    <LogoSVG 
                      name={logo.name} 
                      className="text-muted-foreground group-hover:text-foreground transition-colors duration-300" 
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Second row - right to left */}
          <div className="flex overflow-hidden relative" style={{
            WebkitMask: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            mask: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}>
            <motion.div
              className="flex gap-8 items-center"
              animate={{
                x: [-50 + '%', 0]
              }}
              transition={{
                duration: 30,
                ease: "linear",
                repeat: Infinity
              }}
            >
              {secondRowLogos.map((logo, index) => (
                <motion.div
                  key={`${logo.id}-${index}`}
                  className="flex-shrink-0 group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  title={logo.name}
                >
                  <div className="glass-card p-4 rounded-xl transition-all duration-300 group-hover:shadow-primary/20">
                    <LogoSVG 
                      name={logo.name} 
                      className="text-muted-foreground group-hover:text-foreground transition-colors duration-300" 
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-8 mt-12 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-blink-online"></div>
            <span>500+ Active Clients</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow"></div>
            <span>99.9% Uptime Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
            <span>24/7 Expert Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};