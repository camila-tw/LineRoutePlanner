import { Switch, Route, useLocation } from "wouter";
import { Suspense, lazy } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

// Lazy load pages for better performance
const Home = lazy(() => import("@/pages/home"));
const History = lazy(() => import("@/pages/history"));
const Settings = lazy(() => import("@/pages/settings"));
const Help = lazy(() => import("@/pages/help"));

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

function Router() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar currentPath={location} />
      
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Suspense fallback={<LoadingFallback />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/history" component={History} />
            <Route path="/settings" component={Settings} />
            <Route path="/help" component={Help} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  return <Router />;
}

export default App;
