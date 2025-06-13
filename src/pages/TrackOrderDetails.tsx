
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Clock, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';

interface OrderItem {
  id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderDetails {
  id: string;
  status: string;
  orderDate: string;
  totalAmount: number;
  shippingAddress: string;
  items: OrderItem[];
  trackingHistory: {
    status: string;
    timestamp: string;
    location: string;
    description: string;
  }[];
}

export default function TrackOrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = () => {
      // Mock order details - replace with actual API call
      const mockOrderDetails: OrderDetails = {
        id: orderId || 'ORD123456',
        status: 'shipped',
        orderDate: '2025-06-10T10:30:00Z',
        totalAmount: 1499.99,
        shippingAddress: '123 Main Street, Kathmandu, Bagmati Province, Nepal',
        items: [
          {
            id: 1,
            name: 'Samsung Galaxy S23 Ultra',
            image: '/placeholder.svg',
            quantity: 1,
            price: 1259.10,
            total: 1259.10
          },
          {
            id: 2,
            name: 'Phone Case',
            image: '/placeholder.svg',
            quantity: 2,
            price: 25.99,
            total: 51.98
          }
        ],
        trackingHistory: [
          {
            status: 'Order Placed',
            timestamp: '2025-06-10T10:30:00Z',
            location: 'Kathmandu, Nepal',
            description: 'Your order has been received and is being processed'
          },
          {
            status: 'Order Confirmed',
            timestamp: '2025-06-10T14:15:00Z',
            location: 'Kathmandu, Nepal',
            description: 'Order confirmed and preparing for shipment'
          },
          {
            status: 'Shipped',
            timestamp: '2025-06-11T09:00:00Z',
            location: 'Distribution Center, Kathmandu',
            description: 'Package has been shipped and is on its way'
          },
          {
            status: 'In Transit',
            timestamp: '2025-06-12T08:30:00Z',
            location: 'Delivery Hub, Lalitpur',
            description: 'Package is in transit to your delivery address'
          }
        ]
      };

      setTimeout(() => {
        setOrderDetails(mockOrderDetails);
        setLoading(false);
      }, 1000);
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
            <Button onClick={() => navigate('/track-order')}>Back to Track Order</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/track-order')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600">Order #{orderDetails.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Current Status</span>
                  <Badge className={`${
                    orderDetails.status === 'delivered' ? 'bg-green-500' :
                    orderDetails.status === 'shipped' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`}>
                    {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Package is {orderDetails.status}</p>
                    <p className="text-sm text-gray-600">
                      Last updated: {new Date(orderDetails.trackingHistory[orderDetails.trackingHistory.length - 1].timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Rs. {item.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Rs. {item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-xl font-bold text-orange-500">
                      Rs. {orderDetails.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking History */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetails.trackingHistory.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{event.status}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location}
                        </div>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                  <p className="text-sm text-gray-600">{orderDetails.shippingAddress}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Order Date</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(orderDetails.orderDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Estimated Delivery</h4>
                  <p className="text-sm text-gray-600">
                    {orderDetails.status === 'delivered' ? 'Delivered' : '2-3 business days'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Have questions about your order? Our support team is here to help.
                </p>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
