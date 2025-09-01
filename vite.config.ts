import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize bundle splitting for performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-accordion', '@radix-ui/react-select'],
          query: ['@tanstack/react-query'],
          motion: ['framer-motion'],
          charts: ['recharts'],
          carousel: ['embla-carousel-react'],
          calendar: ['react-day-picker'],
        },
      },
    },
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging while keeping performance
    sourcemap: mode === 'development',
    // Optimize for modern browsers
    target: 'esnext',
    minify: 'esbuild',
  },
  // Enable dependency pre-bundling optimization
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      '@tanstack/react-query',
      'framer-motion',
      'lucide-react',
      '@supabase/supabase-js' // Include instead of exclude to fix module resolution
    ],
  },
}));
