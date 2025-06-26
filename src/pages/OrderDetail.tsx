
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Calendar, CreditCard, User } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiClient } from '@/lib/api';
import { format } from 'date-fns';

interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  formattedTotalPrice: string;
}

interface OrderDetail {
  id: number;
  userId: number;
  orderDate: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  shippingAddress: string;
  shippingCity: string;
  items: OrderItem[];
}

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const { data: orderResponse, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => apiClient.getOrderById(Number(orderId)),
    enabled: !!orderId,
  });

  const order: OrderDetail = orderResponse?.data;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'confirmed':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
            <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
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
            onClick={() => navigate('/orders')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600">Order #{order.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Status</span>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(order.orderStatus)}>
                      {order.orderStatus}
                    </Badge>
                    <Badge className={getStatusColor(order.paymentStatus)} variant="outline">
                      Payment: {order.paymentStatus}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Order is {order.orderStatus.toLowerCase()}</p>
                    <p className="text-sm text-gray-600">
                      Placed on {format(new Date(order.orderDate), 'MMM dd, yyyy at hh:mm a')}
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          Product #{item.productId}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>Rs. {item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="font-semibold">
                          {item.formattedTotalPrice}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-xl font-bold text-orange-500">
                      Rs. {order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Order Date</h4>
                    <p className="text-sm text-gray-600">
                      {format(new Date(order.orderDate), 'MMMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(order.orderDate), 'hh:mm a')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Customer ID</h4>
                    <p className="text-sm text-gray-600">#{order.userId}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Items Count</h4>
                    <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Delivery Address</h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingCity}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Payment Status</h4>
                    <Badge className={getStatusColor(order.paymentStatus)} variant="outline">
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="text-sm">Rs. {order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total:</span>
                    <span className="text-lg text-orange-500">Rs. {order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/track-order')} 
                className="w-full"
              >
                Track Order
              </Button>
              <Button 
                onClick={() => navigate('/shop')} 
                variant="outline" 
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
