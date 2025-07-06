-- إضافة حقل الأحجام للمنتجات
ALTER TABLE public.products 
ADD COLUMN sizes jsonb DEFAULT '[]'::jsonb;

-- إضافة تعليق للتوضيح
COMMENT ON COLUMN public.products.sizes IS 'أحجام المنتج مع الأسعار - مثال: [{"size": "صغير", "price": 10}, {"size": "متوسط", "price": 15}, {"size": "كبير", "price": 20}]';