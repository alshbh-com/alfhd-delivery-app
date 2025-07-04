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
    console.log('Received request to send notification:', notificationId);

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
      console.error('Notification not found:', notificationError);
      throw new Error('Notification not found');
    }

    console.log('Found notification:', notification.title);

    // For testing, we'll use the test FCM token provided by the user
    const testDevices = [{ 
      fcm_token: '66488835213', 
      user_id: 'test_user' 
    }];

    console.log('Using test device token: 66488835213');

    const fcmServerKey = Deno.env.get('FCM_SERVER_KEY');
    if (!fcmServerKey) {
      throw new Error('FCM server key not configured');
    }

    console.log('FCM Server Key configured, first 10 chars:', fcmServerKey.substring(0, 10));

    // Simplified FCM payload
    const payload = {
      to: '66488835213', // Direct token instead of registration_ids
      notification: {
        title: notification.title,
        body: notification.message,
        icon: '/icon-192.png',
        sound: 'default'
      },
      data: {
        notificationId: notification.id,
        type: 'admin_notification'
      }
    };

    console.log('Sending FCM payload:', JSON.stringify(payload, null, 2));

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
    
    console.log('FCM Response Status:', fcmResponse.status);
    console.log('FCM Response:', JSON.stringify(fcmResult, null, 2));
    
    if (!fcmResponse.ok) {
      console.error('FCM Error Response:', fcmResult);
      throw new Error(`FCM Error: ${fcmResult.error || 'Unknown error'}`);
    }

    // Update notification status
    const { error: updateError } = await supabase
      .from('notifications')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        sent_count: fcmResult.success || 1
      })
      .eq('id', notificationId);

    if (updateError) {
      console.error('Failed to update notification status:', updateError);
    }

    console.log('Notification sent successfully!');

    return new Response(
      JSON.stringify({ 
        success: true, 
        sentCount: fcmResult.success || 1,
        failedCount: fcmResult.failure || 0,
        messageId: fcmResult.message_id,
        results: fcmResult
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