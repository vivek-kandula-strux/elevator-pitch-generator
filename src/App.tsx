import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy, useEffect } from "react";
import { GTMProvider } from "@/contexts/GTMContext";
import { FloatingWidget } from "@/components/FloatingWidget";
import { PageSkeleton, ServicesSkeleton } from "@/components/loading/PageSkeleton";
import { measureFCP, estimateBundleImpact, logBundleSplit } from "@/utils/performanceMonitor";
import { AppOptimizations, PerformanceAnalytics } from "@/components/AppOptimizations";

// Import FormPage immediately (main landing page)
import FormPage from "./pages/FormPage";
import NotFound from "./pages/NotFound";

// Lazy load heavy pages with performance tracking
const LazyServicesPage = lazy(() => {
  logBundleSplit('ServicesPage');
  return import("./pages/ServicesPage");
});

const LazyContactPage = lazy(() => {
  logBundleSplit('ContactPage');
  return import("./pages/ContactPage");
});

const LazyResultsPage = lazy(() => {
  logBundleSplit('ResultsPage');
  return import("./pages/ResultsPage");
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Aggressive caching: data stays fresh for 5 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Keep data in cache for 15 minutes (gcTime is the new name for cacheTime)
      gcTime: 15 * 60 * 1000, // 15 minutes
      // Reduce retries to minimize API calls
      retry: 1,
      // Disable refetch on window focus to reduce API calls
      refetchOnWindowFocus: false,
      // Background refetch every 2 minutes for fresh data
      refetchInterval: 2 * 60 * 1000, // 2 minutes
      // Enable background refetch only when window is focused
      refetchIntervalInBackground: false,
      // Request deduplication - avoid duplicate requests
      refetchOnMount: true,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  // Monitor performance on app load
  useEffect(() => {
    measureFCP();
    estimateBundleImpact();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GTMProvider>
            {/* Performance optimizations */}
            <AppOptimizations />
            <PerformanceAnalytics />
            
            <Routes>
              <Route path="/" element={<FormPage />} />
              <Route 
                path="/services" 
                element={
                  <Suspense fallback={<ServicesSkeleton />}>
                    <LazyServicesPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <LazyContactPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/results/:recordId" 
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <LazyResultsPage />
                  </Suspense>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <FloatingWidget />
          </GTMProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
};

export default App;
