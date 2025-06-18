
import { useState } from 'react';
import { Bell, CircleX, Loader2, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { data: notifications } = useQuery({
    queryKey: ['notifications', user?.nameid],
    queryFn: () => {
      // Mock notifications for now since the API doesn't have this endpoint
      return Promise.resolve({
        data: [
          {
            id: 1,
            title: "Order Confirmed",
            message: "Your order #123 has been confirmed",
            isRead: false,
            status: "success",
            timestamp: new Date().toISOString()
          },
          {
            id: 2,
            title: "Payment Processing",
            message: "Your payment is being processed",
            isRead: false,
            status: "pending",
            timestamp: new Date().toISOString()
          }
        ]
      });
    },
    enabled: !!user?.nameid,
  });

  const markAsRead = async (notificationId: number) => {
    setIsLoading(true);
    try {
      // await apiClient.markNotificationAsRead(notificationId);
      // Refresh notifications after marking as read
      // queryClient.invalidateQueries('notifications');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          {notifications?.data?.filter(notification => !notification.isRead).length > 0 && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!notifications?.data || notifications.data.length === 0 ? (
          <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
        ) : (
          notifications.data.map((notification) => (
            <DropdownMenuItem key={notification.id} onClick={() => markAsRead(notification.id)}>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.message}</p>
                </div>
                
                {notification.status === 'success' && (
                  <CheckCircle className="text-green-500 h-4 w-4" />
                )}
                {notification.status === 'pending' && (
                  <Loader2 className="text-blue-500 h-4 w-4 animate-spin" />
                )}
                {notification.status === 'failed' && (
                  <CircleX className="text-red-500 h-4 w-4" />
                )}

                <div className={`w-2 h-2 rounded-full ${
                  notification.isRead ? 'bg-gray-400' : 'bg-blue-500'
                }`} />
                
                <span className="text-xs text-gray-500">
                  {new Date(notification.timestamp || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
