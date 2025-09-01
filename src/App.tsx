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
import { PerformanceMonitor } from "@/components/performance/PerformanceMonitor";

// Lazy load ALL pages including FormPage for maximum performance
const LazyFormPage = lazy(() => {
  logBundleSplit('FormPage');
  return import("./pages/FormPage");
});

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

import NotFound from "./pages/NotFound";
import { GoogleSheetsDebug } from "@/components/GoogleSheetsDebug";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Ultra-aggressive caching for performance
      staleTime: 10 * 60 * 1000, // 10 minutes (increased from 5)
      gcTime: 30 * 60 * 1000, // 30 minutes cache retention
      retry: 1,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Minimize background refetching for performance
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Changed to false for performance
      refetchOnReconnect: 'always',
      refetchInterval: false, // Disabled automatic refetch
      refetchIntervalInBackground: false,
      // Enable request deduplication
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
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
            <PerformanceMonitor />
            
            <Routes>
              <Route 
                path="/" 
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <LazyFormPage />
                  </Suspense>
                } 
              />
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
              <Route path="/debug" element={<GoogleSheetsDebug />} />
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
