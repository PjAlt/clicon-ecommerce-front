
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, MapPin, CreditCard } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { format } from 'date-fns';
import { Order } from '@/types/api';

export default function OrderHistory() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Get user ID from auth context or localStorage as fallback
  const getUserId = () => {
    if (user?.nameid) {
      console.log('User ID from auth context:', user.nameid);
      return user.nameid;
    }
    
    // Fallback to localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const userId = parsed.id || parsed.userId;
        console.log('User ID from localStorage:', userId);
        return userId;
      } catch (error) {
        console.error('Error parsing userData from localStorage:', error);
        return null;
      }
    }
    
    console.log('No user ID found');
    return null;
  };

  const userId = getUserId();

  // Check authentication state and redirect if needed
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !userId) {
      console.log('User not authenticated, redirecting to home');
      toast({
        title: "Authentication Required",
        description: "Please log in to view your order history.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [authLoading, isAuthenticated, userId, navigate, toast]);

  const { data: ordersResponse, isLoading, error } = useQuery({
    queryKey: ['orders', userId, currentPage],
    queryFn: async () => {
      console.log('Fetching orders for user ID:', userId);
      try {
        const response = await apiClient.getAllOrdersByUserId(userId, currentPage, pageSize);
        console.log('Orders response:', response);
        return response;
      } catch (err) {
        console.error('Error fetching orders:', err);
        if (err.response?.status === 401) {
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please login again.",
            variant: "destructive",
          });
          navigate('/');
        }
        throw err;
      }
    },
    enabled: !!userId && isAuthenticated,
  });

  const orders: Order[] = ordersResponse?.data || [];

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

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated && !userId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your orders</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to access your order history.</p>
            <Button onClick={() => navigate('/')}>Go to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error loading orders</h1>
            <p className="text-gray-600 mb-4">There was an error loading your orders. Please try again.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">Track and manage your orders</p>
          {user && (
            <p className="text-sm text-gray-500 mt-1">Logged in as: {user.email}</p>
          )}
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
              <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(order.orderStatus)}>
                        {order.orderStatus}
                      </Badge>
                      <Badge className={getStatusColor(order.paymentStatus)} variant="outline">
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-medium">
                          {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Shipping Address</p>
                        <p className="font-medium">{order.shippingAddress}, {order.shippingCity}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-medium text-lg">Rs. {order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Items</p>
                        <p className="font-medium">{order.items.length} item(s)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      {order.items.length} item(s) • Rs. {order.totalAmount.toFixed(2)}
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {orders.length === pageSize && (
              <div className="text-center">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Load More Orders
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
