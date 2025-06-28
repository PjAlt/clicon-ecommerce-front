
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export default function PaymentVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [gateway, setGateway] = useState<'esewa' | 'khalti' | 'cod' | null>(null);
  const [payment, setPayment] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Get userId from localStorage or auth context if available
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserId(parsed?.id || parsed?.userId || null);
      } catch {
        setUserId(null);
      }
    }
  }, []);

  // Payment verification logic
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pathname = location.pathname;

    // Determine gateway based on URL path and params
    if (pathname.includes('/callback/esewa/success') || params.get('data')) {
      setGateway('esewa');
      verifyEsewa(params);
    } else if (pathname.includes('/callback/khalti/success') || params.get('pidx')) {
      setGateway('khalti');
      verifyKhalti(params);
    } else if (pathname.includes('/callback/esewa/failure')) {
      setGateway('esewa');
      handleEsewaFailure(params);
    } else if (pathname.includes('/callback/khalti/failure')) {
      setGateway('khalti');
      handleKhaltiFailure(params);
    } else {
      // Direct access to /payment/success or /payment/verification
      setGateway('cod');
      setStatus('success');
    }
  }, [location.pathname, location.search]);

  // Fetch latest payment after verification
  useEffect(() => {
    if (status === 'success' && userId) {
      apiClient
        .getLatestPayment(userId)
        .then((res: any) => setPayment(res.data?.[0]))
        .catch(() => setPayment(null));
    }
  }, [status, userId]);

  const verifyEsewa = async (params: URLSearchParams) => {
    try {
      setStatus('pending');
      const data = params.get('data');
      
      if (!data) {
        throw new Error('Missing eSewa params');
      }
      
      await apiClient.request('GET', `/payment/callback/esewa/success?data=${data}`);
      
      setStatus('success');
      
      // Clear pending payment from localStorage
      localStorage.removeItem('pendingPayment');
      
      toast({
        title: 'Payment Successful',
        description: 'Your eSewa payment was successful!',
      });

      // Navigate to success page after verification
      setTimeout(() => {
        navigate('/payment/success/esewa');
      }, 2000);
      
    } catch (error) {
      console.error('eSewa payment verification failed:', error);
      setStatus('failed');
      
      toast({
        title: 'Verification Error',
        description: 'Failed to verify eSewa payment.',
        variant: 'destructive',
      });

      // Navigate to failure page
      setTimeout(() => {
        navigate('/payment/callback/esewa/failure' + location.search);
      }, 2000);
    }
  };

  const verifyKhalti = async (params: URLSearchParams) => {
    try {
      setStatus('pending');
      const pidx = params.get('pidx');
      const amount = params.get('amount');
      const purchase_order_id = params.get('purchase_order_id');
      const transaction_id = params.get('transaction_id');
      
      if (!pidx || !amount || !purchase_order_id || !transaction_id) {
        throw new Error('Missing Khalti params');
      }
      
      await apiClient.request(
        'GET',
        `/payment/callback/khalti/success?pidx=${pidx}&amount=${amount}&purchase_order_id=${purchase_order_id}&transaction_id=${transaction_id}`
      );
      
      setStatus('success');
      
      // Clear pending payment from localStorage
      localStorage.removeItem('pendingPayment');
      
      toast({
        title: 'Payment Successful',
        description: 'Your Khalti payment was successful!',
      });

      // Navigate to success page after verification
      setTimeout(() => {
        navigate('/payment/success/khalti');
      }, 2000);
      
    } catch (error) {
      console.error('Khalti payment verification failed:', error);
      setStatus('failed');
      
      toast({
        title: 'Verification Error',
        description: 'Failed to verify Khalti payment.',
        variant: 'destructive',
      });

      // Navigate to failure page
      setTimeout(() => {
        navigate('/payment/khalti-failure' + location.search);
      }, 2000);
    }
  };

  const handleEsewaFailure = async (params: URLSearchParams) => {
    try {
      // Call the failure callback endpoint for eSewa if needed
      const data = params.get('data');
      if (data) {
        await apiClient.request('GET', `/payment/callback/esewa/failure?data=${data}`);
      }
    } catch (error) {
      console.error('Error handling eSewa payment failure callback:', error);
    }
    
    // Navigate to failure page
    navigate('/payment/esewa-failure' + location.search);
  };

  const handleKhaltiFailure = async (params: URLSearchParams) => {
    try {
      // Call the failure callback endpoint for Khalti if needed
      const pidx = params.get('pidx');
      if (pidx) {
        await apiClient.request('GET', `/payment/callback/khalti/failure?pidx=${pidx}`);
      }
    } catch (error) {
      console.error('Error handling Khalti payment failure callback:', error);
    }
    
    // Navigate to failure page
    navigate('/payment/khalti-failure' + location.search);
  };

  // UI rendering for verification process
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {status === 'pending' && <Clock className="h-16 w-16 text-blue-500 animate-spin" />}
                {status === 'success' && <CheckCircle className="h-16 w-16 text-green-500" />}
                {status === 'failed' && <AlertCircle className="h-16 w-16 text-red-500" />}
              </div>
              
              <CardTitle className="text-2xl">
                {status === 'pending' && 'Verifying Payment...'}
                {status === 'success' && 'Payment Verified!'}
                {status === 'failed' && 'Payment Verification Failed'}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-4">
              {status === 'pending' && (
                <p className="text-gray-600">
                  Please wait while we verify your payment
                  {gateway && gateway !== 'cod' ? ` with ${gateway.toUpperCase()}` : ''}. 
                  This may take a few moments.
                </p>
              )}

              {status === 'success' && payment?.paymentMethodName === 'COD' && (
                <>
                  <p className="text-gray-700 mb-2">
                    Your order has been placed and is being processed.<br />
                    Please prepare the exact amount of <b>Rs. {payment.orderTotal}</b> in cash.<br />
                    Our delivery person will contact you and collect the payment upon delivery.
                  </p>
                  <div className="mb-2">
                    <b>Payment Status:</b>{' '}
                    {payment.paymentStatus === 'PendingDelivery'
                      ? 'Pending Delivery'
                      : payment.paymentStatus}
                  </div>
                  <div className="text-sm text-gray-500">
                    You will receive a call or SMS before delivery. Thank you for shopping with us!
                  </div>
                  <div className="space-y-2 mt-4">
                    <Button onClick={() => navigate('/track-order')} className="w-full">
                      Track Your Order
                    </Button>
                    <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </div>
                </>
              )}

              {status === 'success' && payment?.paymentMethodName !== 'COD' && (
                <>
                  <p className="text-gray-600">
                    Payment verification successful! Redirecting you to the success page...
                  </p>
                  <div className="text-sm text-gray-500">
                    Gateway: {gateway?.toUpperCase()}
                  </div>
                </>
              )}

              {status === 'failed' && (
                <>
                  <p className="text-gray-600">
                    We couldn't verify your payment. Redirecting you to try again...
                  </p>
                  <div className="text-sm text-gray-500">
                    Gateway: {gateway?.toUpperCase()}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
