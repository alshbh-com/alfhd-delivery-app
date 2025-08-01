-- إضافة جدول المفضلة والطلبات السريعة
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('product', 'cart')), -- product للمنتجات المفردة، cart للطلبات الكاملة
  item_data JSONB NOT NULL, -- بيانات المنتج أو السلة
  name TEXT NOT NULL, -- اسم المفضلة
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- إنشاء policies
CREATE POLICY "Users can view their own favorites" 
ON public.user_favorites 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own favorites" 
ON public.user_favorites 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own favorites" 
ON public.user_favorites 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete their own favorites" 
ON public.user_favorites 
FOR DELETE 
USING (true);

-- إضافة trigger للتحديث التلقائي لـ updated_at
CREATE TRIGGER update_user_favorites_updated_at
BEFORE UPDATE ON public.user_favorites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();