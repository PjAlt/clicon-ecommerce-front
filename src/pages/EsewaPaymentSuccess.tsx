
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export default function EsewaPaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      setIsVerifying(true);
      
      // Get the data parameter from URL
      const dataParam = searchParams.get('data');
      
      // Get stored payment details
      const pendingPayment = localStorage.getItem('pendingPayment');
      if (!pendingPayment) {
        throw new Error('No pending payment found');
      }

      const paymentData = JSON.parse(pendingPayment);
      
      // Call verification endpoint
      const response = await apiClient.verifyPayment(
        paymentData.paymentRequestId,
        paymentData.esewaTransactionId,
        paymentData.khaltiPidx,
        '1' // Success status
      );

      console.log('Payment verification response:', response);
      
      setVerificationStatus('success');
      
      // Clear pending payment from localStorage
      localStorage.removeItem('pendingPayment');
      
      toast({
        title: "Payment Successful",
        description: "Your order has been placed successfully!",
      });

    } catch (error) {
      console.error('Payment verification error:', error);
      setVerificationStatus('failed');
      
      toast({
        title: "Verification Error",
        description: "Failed to verify payment. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {verificationStatus === 'pending' && (
                  <Clock className="h-16 w-16 text-blue-500 animate-spin" />
                )}
                {verificationStatus === 'success' && (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                )}
                {verificationStatus === 'failed' && (
                  <AlertCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              
              <CardTitle className="text-2xl">
                {verificationStatus === 'pending' && 'Verifying Payment...'}
                {verificationStatus === 'success' && 'Payment Successful!'}
                {verificationStatus === 'failed' && 'Payment Verification Failed'}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-4">
              {verificationStatus === 'pending' && (
                <p className="text-gray-600">
                  Please wait while we verify your payment with eSewa. This may take a few moments.
                </p>
              )}
              
              {verificationStatus === 'success' && (
                <>
                  <p className="text-gray-600">
                    Your payment has been processed successfully through eSewa. Your order is being prepared.
                  </p>
                  <div className="space-y-2">
                    <Button onClick={() => navigate('/track-order')} className="w-full">
                      Track Your Order
                    </Button>
                    <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </div>
                </>
              )}
              
              {verificationStatus === 'failed' && (
                <>
                  <p className="text-gray-600">
                    We couldn't verify your payment. If you completed the payment on eSewa, please contact support with your transaction details.
                  </p>
                  <div className="space-y-2">
                    <Button onClick={() => navigate('/checkout')} className="w-full">
                      Try Again
                    </Button>
                    <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                      Back to Home
                    </Button>
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
