-- إضافة جداول جديدة لدعم جميع الميزات المطلوبة

-- جدول المراجعات والتقييمات
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  sub_category_id UUID REFERENCES public.sub_categories(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول نقاط الولاء
CREATE TABLE public.loyalty_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  level TEXT NOT NULL DEFAULT 'bronze' CHECK (level IN ('bronze', 'silver', 'gold', 'platinum')),
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- جدول تاريخ النقاط
CREATE TABLE public.points_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  points INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earned', 'redeemed')),
  description TEXT,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول التفضيلات والتوصيات
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  favorite_categories JSONB DEFAULT '[]'::jsonb,
  favorite_sub_categories JSONB DEFAULT '[]'::jsonb,
  favorite_products JSONB DEFAULT '[]'::jsonb,
  dietary_preferences JSONB DEFAULT '[]'::jsonb,
  price_range JSONB DEFAULT '{"min": 0, "max": 1000}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- جدول قوائم الأمنيات
CREATE TABLE public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'قائمة أمنياتي',
  items JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول الطلبات الجماعية
CREATE TABLE public.group_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  sub_category_id UUID REFERENCES public.sub_categories(id) ON DELETE CASCADE,
  target_amount NUMERIC,
  current_amount NUMERIC DEFAULT 0,
  participants JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول المتابعة بين المستخدمين
CREATE TABLE public.user_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_user_id TEXT NOT NULL,
  following_user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_user_id, following_user_id)
);

-- إضافة حقول جديدة للجداول الموجودة
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS average_rating NUMERIC DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS nutritional_info JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS allergens JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.sub_categories ADD COLUMN IF NOT EXISTS average_rating NUMERIC DEFAULT 0;
ALTER TABLE public.sub_categories ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE public.sub_categories ADD COLUMN IF NOT EXISTS cuisine_type TEXT;
ALTER TABLE public.sub_categories ADD COLUMN IF NOT EXISTS delivery_time_min INTEGER DEFAULT 30;
ALTER TABLE public.sub_categories ADD COLUMN IF NOT EXISTS delivery_time_max INTEGER DEFAULT 60;
ALTER TABLE public.sub_categories ADD COLUMN IF NOT EXISTS minimum_order NUMERIC DEFAULT 0;
ALTER TABLE public.sub_categories ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC DEFAULT 0;
ALTER TABLE public.sub_categories ADD COLUMN IF NOT EXISTS payment_methods JSONB DEFAULT '["cash", "card"]'::jsonb;

-- تفعيل RLS على الجداول الجديدة
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- سياسات RLS للمراجعات (يمكن للجميع قراءتها، المستخدمون يمكنهم إضافة مراجعاتهم فقط)
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create their own reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE USING (true);

-- سياسات لنقاط الولاء
CREATE POLICY "Users can view their own loyalty points" ON public.loyalty_points FOR SELECT USING (true);
CREATE POLICY "Users can insert their own loyalty points" ON public.loyalty_points FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own loyalty points" ON public.loyalty_points FOR UPDATE USING (true);

-- سياسات لتاريخ النقاط
CREATE POLICY "Users can view their own points history" ON public.points_history FOR SELECT USING (true);
CREATE POLICY "Users can insert points history" ON public.points_history FOR INSERT WITH CHECK (true);

-- سياسات للتفضيلات
CREATE POLICY "Users can manage their own preferences" ON public.user_preferences FOR ALL USING (true);

-- سياسات لقوائم الأمنيات
CREATE POLICY "Users can view public wishlists and their own" ON public.wishlists FOR SELECT USING (is_public = true OR true);
CREATE POLICY "Users can manage their own wishlists" ON public.wishlists FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own wishlists" ON public.wishlists FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own wishlists" ON public.wishlists FOR DELETE USING (true);

-- سياسات للطلبات الجماعية
CREATE POLICY "Anyone can view active group orders" ON public.group_orders FOR SELECT USING (true);
CREATE POLICY "Users can create group orders" ON public.group_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Creators can update their group orders" ON public.group_orders FOR UPDATE USING (true);

-- سياسات للمتابعة
CREATE POLICY "Anyone can view follows" ON public.user_follows FOR SELECT USING (true);
CREATE POLICY "Users can manage their follows" ON public.user_follows FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete their follows" ON public.user_follows FOR DELETE USING (true);

-- فهارس لتحسين الأداء
CREATE INDEX idx_reviews_sub_category ON public.reviews(sub_category_id);
CREATE INDEX idx_reviews_product ON public.reviews(product_id);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_loyalty_points_user ON public.loyalty_points(user_id);
CREATE INDEX idx_points_history_user ON public.points_history(user_id);
CREATE INDEX idx_user_preferences_user ON public.user_preferences(user_id);
CREATE INDEX idx_wishlists_user ON public.wishlists(user_id);
CREATE INDEX idx_group_orders_creator ON public.group_orders(creator_user_id);
CREATE INDEX idx_group_orders_status ON public.group_orders(status);
CREATE INDEX idx_user_follows_follower ON public.user_follows(follower_user_id);
CREATE INDEX idx_user_follows_following ON public.user_follows(following_user_id);
CREATE INDEX idx_products_rating ON public.products(average_rating);
CREATE INDEX idx_sub_categories_rating ON public.sub_categories(average_rating);

-- فهارس البحث النصي
CREATE INDEX idx_products_search ON public.products USING gin(to_tsvector('arabic', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_sub_categories_search ON public.sub_categories USING gin(to_tsvector('arabic', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_main_categories_search ON public.main_categories USING gin(to_tsvector('arabic', name || ' ' || COALESCE(description, '')));