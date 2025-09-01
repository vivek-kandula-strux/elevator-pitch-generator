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
    // Aggressive bundle splitting for maximum performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Critical vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          
          // UI library chunks
          'ui-radix': ['@radix-ui/react-dialog', '@radix-ui/react-accordion', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-tooltip'],
          'ui-form': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'ui-theme': ['next-themes'],
          
          // Animation and visual chunks
          'motion': ['framer-motion'],
          'charts': ['recharts'],
          'carousel': ['embla-carousel-react'],
          'calendar': ['react-day-picker', 'date-fns'],
          'icons': ['lucide-react'],
          
          // Utility chunks
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],
          'supabase': ['@supabase/supabase-js'],
          'toast': ['sonner'],
        },
        // Optimize chunk naming for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '') : 'chunk';
          return `js/[name]-[hash:8].js`;
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'css/[name]-[hash:8][extname]';
          }
          return 'assets/[name]-[hash:8][extname]';
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
