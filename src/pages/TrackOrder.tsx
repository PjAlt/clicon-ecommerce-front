
import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { toast } from '@/hooks/use-toast';

interface OrderStatus {
  id: string;
  status: 'processing' | 'shipped' | 'delivered';
  timestamp: string;
  location?: string;
}

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      toast({
        title: "Order ID Required",
        description: "Please enter an order ID to track",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call - replace with actual API integration
    setTimeout(() => {
      // Mock order status based on order ID
      const mockStatus: OrderStatus = {
        id: orderId,
        status: orderId.includes('123') ? 'delivered' : orderId.includes('456') ? 'shipped' : 'processing',
        timestamp: new Date().toISOString(),
        location: 'Kathmandu, Nepal'
      };
      
      setOrderStatus(mockStatus);
      setLoading(false);
    }, 1500);
  };

  const getStatusIcon = (status: string, isActive: boolean) => {
    const iconClass = `h-6 w-6 ${isActive ? 'text-orange-500' : 'text-gray-400'}`;
    
    switch (status) {
      case 'processing':
        return <Clock className={iconClass} />;
      case 'shipped':
        return <Truck className={iconClass} />;
      case 'delivered':
        return <CheckCircle className={iconClass} />;
      default:
        return <Package className={iconClass} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Order Processing';
      case 'shipped':
        return 'Order Shipped';
      case 'delivered':
        return 'Order Delivered';
      default:
        return 'Unknown Status';
    }
  };

  const statusSteps = [
    { key: 'processing', label: 'Order Processing', description: 'Your order is being prepared' },
    { key: 'shipped', label: 'Order Shipped', description: 'Your order is on the way' },
    { key: 'delivered', label: 'Order Delivered', description: 'Your order has been delivered' }
  ];

  const getCurrentStepIndex = (status: string) => {
    switch (status) {
      case 'processing': return 0;
      case 'shipped': return 1;
      case 'delivered': return 2;
      default: return -1;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your order ID below to track your package and see its current status and location.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Enter Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Enter your order ID (e.g., ORD123456)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600"
                  disabled={loading}
                >
                  {loading ? 'Tracking...' : 'Track Order'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Display */}
        {orderStatus && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order #{orderStatus.id}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    orderStatus.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    orderStatus.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {getStatusText(orderStatus.status)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Status Timeline */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-8">
                    {statusSteps.map((step, index) => {
                      const isActive = index <= getCurrentStepIndex(orderStatus.status);
                      const isCompleted = index < getCurrentStepIndex(orderStatus.status);
                      
                      return (
                        <div key={step.key} className="flex flex-col items-center text-center flex-1">
                          {/* Icon */}
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                            isActive ? 'bg-orange-100 border-2 border-orange-500' : 'bg-gray-100 border-2 border-gray-300'
                          }`}>
                            {getStatusIcon(step.key, isActive)}
                          </div>
                          
                          {/* Label */}
                          <h3 className={`font-semibold mb-1 ${isActive ? 'text-orange-500' : 'text-gray-500'}`}>
                            {step.label}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-sm text-gray-600 max-w-32">
                            {step.description}
                          </p>
                          
                          {/* Progress Line */}
                          {index < statusSteps.length - 1 && (
                            <div className={`absolute top-6 left-0 right-0 h-0.5 -z-10 ${
                              isCompleted ? 'bg-orange-500' : 'bg-gray-300'
                            }`} 
                            style={{
                              left: `${((index + 1) / statusSteps.length) * 100}%`,
                              width: `${(1 / statusSteps.length) * 100}%`
                            }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium">#{orderStatus.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium">{getStatusText(orderStatus.status)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">
                          {new Date(orderStatus.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Delivery Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Location:</span>
                        <span className="font-medium">{orderStatus.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Delivery:</span>
                        <span className="font-medium">
                          {orderStatus.status === 'delivered' ? 'Delivered' : '2-3 business days'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-8 text-center">
                  <Button 
                    onClick={() => window.location.href = `/track-order-details/${orderStatus.id}`}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    View Order Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Section */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you're having trouble tracking your order or need assistance, our customer support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline">Contact Support</Button>
                <Button variant="outline">Live Chat</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
