
import { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import { toast } from '@/hooks/use-toast';
import { Notification } from '@/types/api';

export const useNotifications = (userId?: number) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!userId) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7028/notificationHub')
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log('SignalR Connected');
        
        // Join user group
        await newConnection.invoke('JoinUserGroup', userId.toString());
        
        // Listen for new notifications
        newConnection.on('ReceiveNotification', (notification: Notification) => {
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast notification
          toast({
            title: notification.title,
            description: notification.message,
            duration: 5000,
          });
        });

        setConnection(newConnection);
      } catch (error) {
        console.error('SignalR Connection Error:', error);
      }
    };

    startConnection();

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [userId]);

  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, status: 1 } // Assuming 1 is read status
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, status: 1 }))
    );
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isConnected: connection?.state === signalR.HubConnectionState.Connected,
  };
};
