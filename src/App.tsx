import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Watch from "@/pages/Watch";
import Search from "@/pages/Search";
import Category from "@/pages/Category";
import Legal from "@/pages/Legal";
import MyList from "@/pages/MyList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/category/:type" element={<Category />} />
          <Route path="/:type/:id/watch" element={<Watch />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/my-list" element={<MyList />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;