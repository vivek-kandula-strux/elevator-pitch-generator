import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Client logos with actual storage paths
const clientLogos = [
  { name: "Microsoft", id: 1, filename: "1.png" },
  { name: "Apple", id: 2, filename: "2.png" },
  { name: "Google", id: 3, filename: "3.png" },
  { name: "Amazon", id: 4, filename: "4.png" },
  { name: "Meta", id: 5, filename: "5.png" },
  { name: "Netflix", id: 6, filename: "6.png" },
  { name: "Spotify", id: 7, filename: "7.png" },
  { name: "Adobe", id: 8, filename: "8.png" },
  { name: "Tesla", id: 9, filename: "9.png" },
  { name: "Uber", id: 10, filename: "10.png" },
  { name: "Airbnb", id: 11, filename: "11.png" },
  { name: "Shopify", id: 12, filename: "12.png" },
  { name: "Stripe", id: 13, filename: "13.png" },
  { name: "Slack", id: 14, filename: "14.png" },
  { name: "Zoom", id: 15, filename: "15.png" },
];

const SUPABASE_STORAGE_URL = "https://sgggqrcwfcbtyianduyo.supabase.co/storage/v1/object/public/Client%20Logos";

// Memoized client logo image component with error handling
const ClientLogo = React.memo(({ logo, className }: { logo: { name: string; filename: string }; className?: string }) => {
  const handleImageError = React.useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to a placeholder if image fails to load
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    target.parentElement!.innerHTML = `
      <div class="w-36 h-14 flex items-center justify-center bg-white/95 rounded-lg border border-slate-200/60 shadow-sm">
        <span class="text-sm text-slate-700 font-medium">${logo.name}</span>
      </div>
    `;
  }, [logo.name]);

  return (
    <div className="relative w-36 h-14 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg border border-slate-200/60 shadow-sm">
      <img
        src={`${SUPABASE_STORAGE_URL}/${logo.filename}`}
        alt={`${logo.name} logo`}
        className={`max-w-32 max-h-10 object-contain hover:brightness-110 transition-all duration-300 ${className}`}
        loading="lazy"
        onError={handleImageError}
      />
    </div>
  );
});

ClientLogo.displayName = 'ClientLogo';

export const ClientLogoSlider = React.memo(() => {
  // Memoize duplicated arrays for infinite scroll effect
  const { firstRowLogos, secondRowLogos } = useMemo(() => ({
    firstRowLogos: [...clientLogos.slice(0, 8), ...clientLogos.slice(0, 8)],
    secondRowLogos: [...clientLogos.slice(8), ...clientLogos.slice(8)]
  }), []);

  // Memoized logo components to prevent unnecessary re-renders
  const firstRowComponents = useMemo(() => 
    firstRowLogos.map((logo, index) => (
      <motion.div
        key={`${logo.id}-${index}`}
        className="flex-shrink-0 group cursor-pointer"
        whileHover={{ scale: 1.05 }}
        title={logo.name}
      >
        <ClientLogo 
          logo={logo} 
          className="group-hover:scale-105 transition-transform duration-300" 
        />
      </motion.div>
    )), [firstRowLogos]);

  const secondRowComponents = useMemo(() => 
    secondRowLogos.map((logo, index) => (
      <motion.div
        key={`${logo.id}-${index}`}
        className="flex-shrink-0 group cursor-pointer"
        whileHover={{ scale: 1.05 }}
        title={logo.name}
      >
        <ClientLogo 
          logo={logo} 
          className="group-hover:scale-105 transition-transform duration-300" 
        />
      </motion.div>
    )), [secondRowLogos]);

  return (
    <section className="py-12 lg:py-16 bg-muted/30 relative overflow-hidden border-t border-b border-muted/20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-muted/10 via-background/50 to-muted/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-glow opacity-10 pointer-events-none" />
      
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 lg:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 lg:mb-4 text-white drop-shadow-sm">
            Trusted by Industry Leaders
          </h2>
          <p className="text-sm lg:text-base text-foreground/75 max-w-2xl mx-auto">
            Join thousands of successful businesses that have transformed their digital presence with our solutions.
          </p>
        </motion.div>

        {/* Logo slider container */}
        <div className="relative">
          {/* First row - left to right */}
          <div className="flex overflow-hidden mb-4 lg:mb-6 relative" style={{
            WebkitMask: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            mask: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
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
              {firstRowComponents}
            </motion.div>
          </div>

          {/* Second row - right to left */}
          <div className="flex overflow-hidden relative" style={{
            WebkitMask: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            mask: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
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
              {secondRowComponents}
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
});

ClientLogoSlider.displayName = 'ClientLogoSlider';