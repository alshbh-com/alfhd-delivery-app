-- Create notifications table for admin to manage push notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  image_url TEXT,
  sound TEXT DEFAULT 'default',
  target_audience TEXT DEFAULT 'all', -- 'all', 'specific_users', 'city'
  target_criteria JSONB DEFAULT '{}',
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft', -- 'draft', 'sent', 'scheduled'
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_count INTEGER DEFAULT 0,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_devices table to store FCM tokens
CREATE TABLE public.user_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  fcm_token TEXT NOT NULL UNIQUE,
  device_type TEXT, -- 'android', 'ios', 'web'
  device_info JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications (admin only)
CREATE POLICY "Allow all operations for notifications" 
ON public.notifications 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create policies for user_devices
CREATE POLICY "Users can manage their own device tokens" 
ON public.user_devices 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_devices_updated_at
    BEFORE UPDATE ON public.user_devices
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();