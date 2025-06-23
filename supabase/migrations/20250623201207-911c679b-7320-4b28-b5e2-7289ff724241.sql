
-- إنشاء جدول المناطق المسموحة
CREATE TABLE public.allowed_cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  delivery_price DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول الأقسام الرئيسية
CREATE TABLE public.main_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول الأقسام الفرعية (المتاجر/المطاعم)
CREATE TABLE public.sub_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  main_category_id UUID REFERENCES public.main_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول المنتجات
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_category_id UUID REFERENCES public.sub_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول العروض
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  discount_percentage DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول الطلبات
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_location TEXT,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  whatsapp_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول إعدادات التطبيق
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إدراج المناطق المسموحة
INSERT INTO public.allowed_cities (name, delivery_price) VALUES
('كفر شكر', 15.00),
('البر الشرقي', 15.00),
('تصفا', 20.00),
('هلا', 20.00),
('كفر تصفا', 15.00),
('الزامروانيه', 25.00),
('كفر رجب', 15.00),
('كفر صليب', 20.00),
('البقاشين', 15.00),
('كفر الولجا', 20.00),
('العجيزي', 25.00),
('سنيت', 20.00),
('عزبة بقشو', 15.00),
('عزبة العرب', 15.00),
('قطون', 20.00),
('إشارة', 15.00),
('محطة', 15.00),
('كوبر', 20.00),
('دمالو', 25.00),
('طوخ', 20.00),
('كفر الجزار', 15.00),
('بطا', 20.00),
('كفر سعد', 15.00),
('كفر الأربعين', 20.00),
('برقطا', 25.00),
('عزبة أبو فرج', 15.00),
('كفر الشهاوي', 20.00),
('عزبة الحلة', 15.00),
('كفر عزب غنيم', 20.00),
('كفر حجازي', 15.00),
('كفر عامر', 20.00),
('كفر منصور', 15.00),
('ميت راضي', 25.00),
('كفر علي', 20.00),
('الشقر', 15.00),
('جمجرة', 20.00),
('المنشية الصغيرة', 15.00),
('المنشية الكبيرة', 20.00),
('الصفين', 15.00),
('أبو قصيبة', 20.00),
('بنها', 25.00),
('الشموت', 20.00),
('ملامس', 15.00),
('منيا القمح', 25.00),
('ميت غمر', 30.00);

-- إدراج الإعدادات الأساسية
INSERT INTO public.app_settings (key, value, description) VALUES
('app_open', 'true', 'حالة التطبيق مفتوح/مغلق'),
('welcome_message', 'مرحباً بكم في متجر الفهد', 'رسالة الترحيب'),
('welcome_image', '', 'صورة الترحيب'),
('whatsapp_number', '201024713976', 'رقم واتساب الطلبات'),
('admin_password', '01278006248', 'كلمة مرور الإدارة'),
('stats_password', '01204486263', 'كلمة مرور الإحصائيات'),
('developer_whatsapp', '201204486263', 'رقم واتساب المطور'),
('developer_website', 'alshbh.netlify.app', 'موقع المطور');

-- تفعيل Row Level Security
ALTER TABLE public.allowed_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.main_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان للقراءة العامة
CREATE POLICY "Allow read access to all users" ON public.allowed_cities FOR SELECT USING (true);
CREATE POLICY "Allow read access to all users" ON public.main_categories FOR SELECT USING (true);
CREATE POLICY "Allow read access to all users" ON public.sub_categories FOR SELECT USING (true);
CREATE POLICY "Allow read access to all users" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow read access to all users" ON public.offers FOR SELECT USING (true);
CREATE POLICY "Allow read access to all users" ON public.app_settings FOR SELECT USING (true);

-- سياسات خاصة للطلبات
CREATE POLICY "Allow insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read orders" ON public.orders FOR SELECT USING (true);
