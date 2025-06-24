
-- التأكد من أن RLS مُفعل على جميع الجداول
ALTER TABLE public.main_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allowed_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- حذف السياسات الموجودة إن وُجدت وإعادة إنشائها
DROP POLICY IF EXISTS "Allow insert main categories" ON public.main_categories;
DROP POLICY IF EXISTS "Allow update main categories" ON public.main_categories;
DROP POLICY IF EXISTS "Allow delete main categories" ON public.main_categories;
DROP POLICY IF EXISTS "Allow select main categories" ON public.main_categories;

DROP POLICY IF EXISTS "Allow insert sub categories" ON public.sub_categories;
DROP POLICY IF EXISTS "Allow update sub categories" ON public.sub_categories;
DROP POLICY IF EXISTS "Allow delete sub categories" ON public.sub_categories;
DROP POLICY IF EXISTS "Allow select sub categories" ON public.sub_categories;

DROP POLICY IF EXISTS "Allow insert products" ON public.products;
DROP POLICY IF EXISTS "Allow update products" ON public.products;
DROP POLICY IF EXISTS "Allow delete products" ON public.products;
DROP POLICY IF EXISTS "Allow select products" ON public.products;

DROP POLICY IF EXISTS "Allow insert offers" ON public.offers;
DROP POLICY IF EXISTS "Allow update offers" ON public.offers;
DROP POLICY IF EXISTS "Allow delete offers" ON public.offers;
DROP POLICY IF EXISTS "Allow select offers" ON public.offers;

DROP POLICY IF EXISTS "Allow insert cities" ON public.allowed_cities;
DROP POLICY IF EXISTS "Allow update cities" ON public.allowed_cities;
DROP POLICY IF EXISTS "Allow delete cities" ON public.allowed_cities;
DROP POLICY IF EXISTS "Allow select cities" ON public.allowed_cities;

DROP POLICY IF EXISTS "Allow insert app settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow update app settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow delete app settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow select app settings" ON public.app_settings;

DROP POLICY IF EXISTS "Allow insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow delete orders" ON public.orders;
DROP POLICY IF EXISTS "Allow select orders" ON public.orders;

-- إنشاء سياسات جديدة تسمح بجميع العمليات

-- سياسات للأقسام الرئيسية
CREATE POLICY "Enable all operations for main_categories" ON public.main_categories FOR ALL USING (true) WITH CHECK (true);

-- سياسات للأقسام الفرعية
CREATE POLICY "Enable all operations for sub_categories" ON public.sub_categories FOR ALL USING (true) WITH CHECK (true);

-- سياسات للمنتجات
CREATE POLICY "Enable all operations for products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- سياسات للعروض
CREATE POLICY "Enable all operations for offers" ON public.offers FOR ALL USING (true) WITH CHECK (true);

-- سياسات للمناطق المسموحة
CREATE POLICY "Enable all operations for allowed_cities" ON public.allowed_cities FOR ALL USING (true) WITH CHECK (true);

-- سياسات لإعدادات التطبيق
CREATE POLICY "Enable all operations for app_settings" ON public.app_settings FOR ALL USING (true) WITH CHECK (true);

-- سياسات للطلبات
CREATE POLICY "Enable all operations for orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
