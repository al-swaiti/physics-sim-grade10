import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Vectors from "./pages/Vectors";
import Motion from "./pages/Motion";
import Forces from "./pages/Forces";
import MindMaps from "./pages/MindMaps";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/vectors" component={Vectors} />
      <Route path="/motion" component={Motion} />
      <Route path="/forces" component={Forces} />
      <Route path="/mindmaps" component={MindMaps} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
