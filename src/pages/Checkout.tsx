import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, CreditCard, MapPin, User } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useBackendCart } from '@/hooks/useBackendCart';
import { apiClient } from '@/lib/api';
import { PaymentMethod } from '@/types/cart';
import { toast } from '@/hooks/use-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | undefined>();
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const user = localStorage.getItem('userData');
    if (user) {
      const userData = JSON.parse(user);
      setUserId(userData.nameid);
    }
  }, []);

  const { items, getTotalPrice, getTotalItems } = useBackendCart(userId);

  const { data: paymentMethodsData } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: () => apiClient.getPaymentMethods(),
  });

  const paymentMethods = (paymentMethodsData as any)?.data || [];

  const placeOrderMutation = useMutation({
    mutationFn: () => apiClient.placeOrder(userId!, shippingAddress, shippingCity),
  });

  const createPaymentIntentMutation = useMutation({
    mutationFn: ({ orderId, paymentMethodId }: { orderId: number; paymentMethodId: number }) =>
      apiClient.createPaymentIntent(userId!, orderId, paymentMethodId, 'Order Payment'),
  });

  const handlePlaceOrder = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please login to place an order",
        variant: "destructive",
      });
      return;
    }

    if (!shippingAddress || !shippingCity) {
      toast({
        title: "Error",
        description: "Please fill in all shipping details",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPaymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessingPayment(true);

      // Step 1: Place Order
      const orderResponse = await placeOrderMutation.mutateAsync();
      const orderId = (orderResponse as any)?.id;

      if (!orderId) {
        throw new Error('Failed to create order');
      }

      // Step 2: Create Payment Intent
      const paymentIntentResponse = await createPaymentIntentMutation.mutateAsync({
        orderId,
        paymentMethodId: parseInt(selectedPaymentMethod),
      });

      const paymentData = paymentIntentResponse as any;

      // Store payment details for verification after callback
      localStorage.setItem('pendingPayment', JSON.stringify({
        paymentRequestId: paymentData.data.id,
        orderId: orderId,
        esewaTransactionId: paymentData.data.esewaTransactionId,
        khaltiPidx: paymentData.data.khaltiPidx,
        paymentAmount: paymentData.data.paymentAmount,
        expiresAt: paymentData.data.expiresAt,
      }));

      // step 3 : Redirect to payment provider
      if (paymentData.data.requiresRedirect && paymentData.data.paymentUrl) {
        // Show instructions to user
        toast({
          title: "Redirecting to Payment",
          description: paymentData.data.instructions || "You will be redirected to complete payment",
        });

        // Small delay to show the toast, then redirect
        setTimeout(() => {
          window.location.href = paymentData.data.paymentUrl;
        }, 2000);
      } else {
        // Handle non-redirect payment methods
        navigate('/payment/verification', { 
          state: { paymentRequestId: paymentData.data.id } 
        });
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to access checkout</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart first</p>
          <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/cart')}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Shipping Address</Label>
                  <Input
                    id="address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter your full address"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    placeholder="Enter your city"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <div className="space-y-1">
                    {paymentMethods.map((method: PaymentMethod) => (
                      <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={method.id.toString()} id={`payment-${method.id}`} />
                        <img
                          src={`${baseUrl}/${method.logo}` || '/placeholder.svg'}
                          alt={method.name}
                          className="w-10 object-contain"
                        />
                        <Label htmlFor={`payment-${method.id}`} className="flex-1 cursor-pointer">
                          {method.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.slice(0, 3).map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.product.images?.find((img: any) => img.isMain)?.imageUrl || '/placeholder.svg'}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">
                        Rs. {item.product.currentPrice * item.quantity}
                      </span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-sm text-gray-600 text-center">
                      +{items.length - 3} more items
                    </p>
                  )}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>Rs. {getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>Rs. 0</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>Rs. {getTotalPrice()}</span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessingPayment || !shippingAddress || !shippingCity || !selectedPaymentMethod}
                >
                  {isProcessingPayment ? 'Processing...' : 'Place Order'}
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
