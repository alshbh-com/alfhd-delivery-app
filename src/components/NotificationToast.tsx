import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  image_url?: string;
  sound?: string;
  created_at: string;
}

export const NotificationToast = () => {
  const { toast } = useToast();
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);

  useEffect(() => {
    const checkForNewNotifications = async () => {
      try {
        const { data: notifications, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('status', 'sent')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (notifications && notifications.length > 0) {
          const latestNotification = notifications[0];
          
          if (lastNotificationId !== latestNotification.id) {
            setLastNotificationId(latestNotification.id);
            
            // Show toast notification
            toast({
              title: latestNotification.title,
              description: latestNotification.message,
              duration: 5000,
            });

            // Play sound if specified
            if (latestNotification.sound && latestNotification.sound !== 'none') {
              try {
                const audio = new Audio(`/sounds/${latestNotification.sound}`);
                audio.play().catch(() => {
                  // Ignore audio play errors (browser restrictions)
                });
              } catch (error) {
                console.log('Could not play notification sound');
              }
            }
          }
        }
      } catch (error) {
        console.error('Error checking notifications:', error);
      }
    };

    // Check immediately
    checkForNewNotifications();

    // Set up real-time subscription
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: 'status=eq.sent'
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          
          toast({
            title: newNotification.title,
            description: newNotification.message,
            duration: 5000,
          });

          // Play sound if specified
          if (newNotification.sound && newNotification.sound !== 'none') {
            try {
              const audio = new Audio(`/sounds/${newNotification.sound}`);
              audio.play().catch(() => {
                // Ignore audio play errors
              });
            } catch (error) {
              console.log('Could not play notification sound');
            }
          }
        }
      )
      .subscribe();

    // Poll every 30 seconds as backup
    const interval = setInterval(checkForNewNotifications, 30000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [toast, lastNotificationId]);

  return null;
};