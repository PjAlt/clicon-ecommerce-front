
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function KhaltiPaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              
              <CardTitle className="text-2xl text-green-600">
                Khalti Payment Successful!
              </CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Your payment has been processed successfully through Khalti. 
                Your order is being prepared and you will receive updates shortly.
              </p>
              
              <div className="text-sm text-gray-500 bg-green-50 p-4 rounded">
                <p className="font-medium text-green-700">What happens next?</p>
                <ul className="list-disc list-inside mt-2 text-left space-y-1">
                  <li>Your order will be confirmed within 24 hours</li>
                  <li>You'll receive SMS/email updates on order status</li>
                  <li>Delivery will be arranged based on your location</li>
                  <li>You can track your order anytime using our tracking system</li>
                </ul>
              </div>
              
              <div className="space-y-2 pt-4">
                <Button onClick={() => navigate('/track-order')} className="w-full">
                  Track Your Order
                </Button>
                <Button onClick={() => navigate('/orders')} variant="outline" className="w-full">
                  View Order History
                </Button>
                <Button onClick={() => navigate('/')} variant="ghost" className="w-full">
                  Continue Shopping
                </Button>
              </div>

              <p className="text-xs text-gray-500 pt-2">
                Thank you for choosing our service! If you have any questions, please contact our support team.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
