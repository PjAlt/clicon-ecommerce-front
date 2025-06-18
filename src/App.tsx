
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentVerification from "./pages/PaymentVerification";
import EsewaPaymentSuccess from "./pages/EsewaPaymentSuccess";
import EsewaPaymentFailure from "./pages/EsewaPaymentFailure";
import TrackOrder from "./pages/TrackOrder";
import TrackOrderDetails from "./pages/TrackOrderDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:categoryId" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-verification" element={<PaymentVerification />} />
              <Route path="/payment/callback/esewa/success" element={<EsewaPaymentSuccess />} />
              <Route path="/payment/callback/esewa/failure" element={<EsewaPaymentFailure />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/track-order-details/:orderId" element={<TrackOrderDetails />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
