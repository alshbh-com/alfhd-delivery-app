import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendNotificationRequest {
  notificationId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { notificationId }: SendNotificationRequest = await req.json();

    if (!notificationId) {
      throw new Error('Notification ID is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get notification details
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', notificationId)
      .single();

    if (notificationError || !notification) {
      throw new Error('Notification not found');
    }

    // Get FCM tokens based on target audience
    let tokensQuery = supabase
      .from('user_devices')
      .select('fcm_token, user_id')
      .eq('is_active', true);

    // Filter based on target audience
    if (notification.target_audience === 'city' && notification.target_criteria?.city) {
      // You would need to join with user data to filter by city
      // For now, we'll send to all users
      console.log('Filtering by city:', notification.target_criteria.city);
    }

    const { data: devices, error: devicesError } = await tokensQuery;

    if (devicesError) {
      throw new Error('Failed to fetch device tokens');
    }

    if (!devices || devices.length === 0) {
      throw new Error('No active devices found');
    }

    const fcmServerKey = Deno.env.get('FCM_SERVER_KEY');
    if (!fcmServerKey) {
      throw new Error('FCM server key not configured');
    }

    // Prepare notification payload
    const payload = {
      registration_ids: devices.map(d => d.fcm_token),
      notification: {
        title: notification.title,
        body: notification.message,
        image: notification.image_url || undefined,
        sound: notification.sound || 'default',
        icon: notification.image_url || '/icon-192.png',
        badge: '/icon-192.png',
        click_action: 'FCM_PLUGIN_ACTIVITY',
        priority: 'high'
      },
      data: {
        notificationId: notification.id,
        type: 'admin_notification',
        click_action: 'FCM_PLUGIN_ACTIVITY'
      },
      android: {
        notification: {
          sound: notification.sound === 'chips_crunch' ? 'chips_crunch' : 'default',
          channel_id: 'default',
          priority: 'high',
          default_sound: notification.sound === 'default',
          image: notification.image_url || undefined
        }
      },
      apns: {
        payload: {
          aps: {
            sound: notification.sound === 'chips_crunch' ? 'chips_crunch.mp3' : 'default',
            badge: 1,
            'content-available': 1
          }
        },
        fcm_options: {
          image: notification.image_url || undefined
        }
      }
    };

    // Send notification via FCM
    const fcmResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${fcmServerKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const fcmResult = await fcmResponse.json();
    
    if (!fcmResponse.ok) {
      console.error('FCM Error:', fcmResult);
      throw new Error(`FCM Error: ${fcmResult.error || 'Unknown error'}`);
    }

    console.log('FCM Result:', fcmResult);

    // Update notification status
    const { error: updateError } = await supabase
      .from('notifications')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        sent_count: fcmResult.success || 0
      })
      .eq('id', notificationId);

    if (updateError) {
      console.error('Failed to update notification status:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sentCount: fcmResult.success || 0,
        failedCount: fcmResult.failure || 0,
        results: fcmResult.results
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in send-push-notification function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});