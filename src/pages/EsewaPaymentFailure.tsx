import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function EsewaPaymentFailure() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // Get the data parameter from URL (for debugging/logging)
    const dataParam = searchParams.get('data');
    console.log('eSewa failure callback data:', dataParam);
    
    // Get stored payment details for context
    const pendingPayment = localStorage.getItem('pendingPayment');
    if (pendingPayment) {
      setPaymentData(JSON.parse(pendingPayment));
    }

    // Show failure toast
    toast({
      title: "Payment Failed",
      description: "Your payment was not completed. You can try again.",
      variant: "destructive",
    });
  }, [searchParams]);

  const handleRetryPayment = () => {
    // Keep the pending payment data for retry
    navigate('/checkout');
  };

  const handleCancelOrder = () => {
    // Clear pending payment data
    localStorage.removeItem('pendingPayment');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              
              <CardTitle className="text-2xl text-red-600">
                Payment Failed
              </CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Your payment through eSewa was not completed. This could be due to:
              </p>
              
              <div className="text-left text-sm text-gray-500 bg-gray-50 p-4 rounded">
                <ul className="list-disc list-inside space-y-1">
                  <li>Payment was cancelled</li>
                  <li>Insufficient balance in your eSewa account</li>
                  <li>Network connectivity issues</li>
                  <li>Session timeout</li>
                </ul>
              </div>

              {paymentData && (
                <div className="text-xs text-gray-400 bg-gray-100 p-2 rounded">
                  Order Amount: Rs. {paymentData.paymentAmount}
                </div>
              )}
              
              <div className="space-y-2 pt-4">
                <Button onClick={handleRetryPayment} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Payment Again
                </Button>
                <Button onClick={handleCancelOrder} variant="outline" className="w-full">
                  Cancel Order
                </Button>
              </div>

              <p className="text-xs text-gray-500 pt-2">
                If you believe this is an error, please contact our support team.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
