
-- إضافة سياسات أمان للكتابة والتحديث والحذف لجميع الجداول

-- سياسات للأقسام الرئيسية
CREATE POLICY "Allow insert main categories" ON public.main_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update main categories" ON public.main_categories FOR UPDATE USING (true);
CREATE POLICY "Allow delete main categories" ON public.main_categories FOR DELETE USING (true);

-- سياسات للأقسام الفرعية
CREATE POLICY "Allow insert sub categories" ON public.sub_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update sub categories" ON public.sub_categories FOR UPDATE USING (true);
CREATE POLICY "Allow delete sub categories" ON public.sub_categories FOR DELETE USING (true);

-- سياسات للمنتجات
CREATE POLICY "Allow insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow delete products" ON public.products FOR DELETE USING (true);

-- سياسات للعروض
CREATE POLICY "Allow insert offers" ON public.offers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update offers" ON public.offers FOR UPDATE USING (true);
CREATE POLICY "Allow delete offers" ON public.offers FOR DELETE USING (true);

-- سياسات للمناطق المسموحة
CREATE POLICY "Allow insert cities" ON public.allowed_cities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update cities" ON public.allowed_cities FOR UPDATE USING (true);
CREATE POLICY "Allow delete cities" ON public.allowed_cities FOR DELETE USING (true);

-- سياسات لإعدادات التطبيق
CREATE POLICY "Allow insert app settings" ON public.app_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update app settings" ON public.app_settings FOR UPDATE USING (true);
CREATE POLICY "Allow delete app settings" ON public.app_settings FOR DELETE USING (true);

-- سياسات للطلبات
CREATE POLICY "Allow update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow delete orders" ON public.orders FOR DELETE USING (true);
