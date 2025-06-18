import { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder, LogLevel, HubConnectionState, HubConnection } from "@microsoft/signalr";
import { toast } from '@/hooks/use-toast';
import { Notification } from '@/types/api';

export const useNotifications = (userId?: number) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    const remote = "http://110.34.2.30:5010/";
    const local = "https://localhost:7010/";
    const localack = "https://localhost:7028/api/notification/acknowledge";
    const remoteack = "http://103.140.0.164:7085/api/notification/acknowledge";

    const conn = new HubConnectionBuilder()
      .withUrl(`${local}hubs/notificationhub`, {
        accessTokenFactory: async () => token || '',
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = conn;
    setConnection(conn);

    const startConnection = async () => {
      try {
        await conn.start();
        console.log('SignalR Connected');
        

        // Listen for new notifications
        conn.on('ReceiveNotification', async (notification: Notification) => {
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);

          // Show toast notification
          toast({
            title: notification.title,
            description: notification.message,
            duration: 5000,
          });
        });
      } catch (error) {
        console.error('SignalR Connection Error:', error);
      }
    };

    startConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
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
    isConnected: connection?.state === HubConnectionState.Connected,
  };
};