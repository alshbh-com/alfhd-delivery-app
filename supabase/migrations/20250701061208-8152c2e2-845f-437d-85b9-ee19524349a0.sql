
-- إضافة حقول جديدة لجدول الأقسام الفرعية
ALTER TABLE public.sub_categories 
ADD COLUMN whatsapp_number text,
ADD COLUMN is_open boolean DEFAULT true;

-- إضافة حقل لتتبع القسم الفرعي في جدول الطلبات
ALTER TABLE public.orders 
ADD COLUMN sub_category_id uuid REFERENCES public.sub_categories(id);
