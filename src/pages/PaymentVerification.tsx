
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export default function PaymentVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Auto-verify payment if URL params are present
    const status = searchParams.get('status');
    if (status) {
      verifyPayment(status);
    }
  }, [searchParams]);

  const verifyPayment = async (status: string) => {
    setIsVerifying(true);
    
    try {
      const pendingPayment = localStorage.getItem('pendingPayment');
      if (!pendingPayment) {
        throw new Error('No pending payment found');
      }

      const paymentData = JSON.parse(pendingPayment);
      
      const response = await apiClient.verifyPayment(
        paymentData.paymentRequestId,
        paymentData.esewaTransactionId,
        paymentData.khaltiPidx,
        status
      );

      if (status === '1' || status === 'success') {
        setVerificationStatus('success');
        localStorage.removeItem('pendingPayment');
        toast({
          title: "Payment Successful",
          description: "Your order has been placed successfully!",
        });
      } else {
        setVerificationStatus('failed');
        toast({
          title: "Payment Failed",
          description: "Your payment could not be processed. Please try again.",
          variant: "destructive",
        });
      }
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

  const handleManualVerification = () => {
    const status = '1'; // Assuming success for manual verification
    verifyPayment(status);
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
                  <XCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              
              <CardTitle className="text-2xl">
                {verificationStatus === 'pending' && 'Verifying Payment...'}
                {verificationStatus === 'success' && 'Payment Successful!'}
                {verificationStatus === 'failed' && 'Payment Failed'}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-4">
              {verificationStatus === 'pending' && (
                <>
                  <p className="text-gray-600">
                    Please wait while we verify your payment. This may take a few moments.
                  </p>
                  <Button
                    onClick={handleManualVerification}
                    disabled={isVerifying}
                    variant="outline"
                  >
                    {isVerifying ? 'Verifying...' : 'Click if payment was successful'}
                  </Button>
                </>
              )}
              
              {verificationStatus === 'success' && (
                <>
                  <p className="text-gray-600">
                    Your payment has been processed successfully. Your order is being prepared.
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
                    Your payment could not be processed. Please try again or contact support.
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
