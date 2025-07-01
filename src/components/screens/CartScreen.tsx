import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface CartScreenProps {
  cart: any[];
  selectedCity: string;
  onUpdateCart: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  selectedSubCategory?: string;
}

export const CartScreen = ({ cart, selectedCity, onUpdateCart, onClearCart, selectedSubCategory }: CartScreenProps) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(15);
  const { toast } = useToast();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + deliveryFee;

  // تحديد سعر التوصيل حسب المدينة المختارة
  useEffect(() => {
    const getDeliveryFee = async () => {
      try {
        const { data } = await supabase
          .from('allowed_cities')
          .select('delivery_price')
          .eq('name', selectedCity)
          .eq('is_active', true)
          .single();
        
        if (data) {
          setDeliveryFee(Number(data.delivery_price));
        }
      } catch (error) {
        console.error('Error getting delivery fee:', error);
        setDeliveryFee(15); // القيمة الافتراضية
      }
    };

    if (selectedCity) {
      getDeliveryFee();
    }
  }, [selectedCity]);

  const handleSubmitOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast({
        title: "بيانات مطلوبة",
        description: "يرجى إدخال الاسم ورقم الهاتف",
        variant: "destructive"
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "يرجى إضافة منتجات للسلة أولاً",
        variant: "destructive"
      });
      return;
    }

    // طلب إذن الموقع
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await submitOrderWithLocation(position.coords);
        },
        (error) => {
          console.error('Error getting location:', error);
          submitOrderWithLocation(null);
        }
      );
    } else {
      await submitOrderWithLocation(null);
    }
  };

  const submitOrderWithLocation = async (coords: any) => {
    setIsSubmitting(true);

    try {
      // حفظ الطلب في قاعدة البيانات
      const orderData = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_city: selectedCity,
        customer_location: coords ? `${coords.latitude},${coords.longitude}` : null,
        items: cart,
        total_amount: total,
        delivery_fee: deliveryFee,
        status: 'pending',
        sub_category_id: selectedSubCategory
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      // إرسال الطلب عبر واتساب
      await sendWhatsAppOrder();

      // مسح السلة وإعادة تعيين النموذج
      onClearCart();
      setCustomerName('');
      setCustomerPhone('');

      toast({
        title: "تم إرسال الطلب",
        description: "سيتم التواصل معك قريباً لتأكيد الطلب",
      });

    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendWhatsAppOrder = async () => {
    try {
      // الحصول على رقم واتساب القسم الفرعي
      let whatsappNumber = '201024713976'; // الافتراضي
      
      if (selectedSubCategory) {
        const { data: subCategoryData } = await supabase
          .from('sub_categories')
          .select('whatsapp_number')
          .eq('id', selectedSubCategory)
          .single();
        
        if (subCategoryData?.whatsapp_number) {
          whatsappNumber = subCategoryData.whatsapp_number;
        }
      }

      // تكوين رسالة الطلب
      let message = `🛍️ *طلب جديد من تطبيق طلبيات*\n\n`;
      message += `👤 *اسم العميل:* ${customerName}\n`;
      message += `📱 *رقم الهاتف:* ${customerPhone}\n\n`;
      message += `🛒 *تفاصيل الطلب:*\n`;
      
      cart.forEach(item => {
        message += `• ${item.name} × ${item.quantity} = ${item.price * item.quantity} جنيه\n`;
      });
      
      message += `\n💰 *المجموع الفرعي:* ${subtotal} جنيه\n`;
      message += `🚚 *رسوم التوصيل:* ${deliveryFee} جنيه\n`;
      message += `💳 *المجموع الكلي:* ${total} جنيه\n\n`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="p-4 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">السلة فارغة</h2>
        <p className="text-gray-500">لم تقم بإضافة أي منتجات بعد</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">سلة التسوق</h1>

      {/* عناصر السلة */}
      <div className="space-y-3">
        {cart.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-green-600 font-bold">{item.price} جنيه</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateCart(item.id, item.quantity - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <span className="mx-2 font-semibold">{item.quantity}</span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateCart(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateCart(item.id, 0)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-right mt-2">
                <span className="font-semibold">المجموع: {item.price * item.quantity} جنيه</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ملخص الطلب */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">ملخص الطلب</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span>{subtotal} جنيه</span>
            </div>
            <div className="flex justify-between">
              <span>رسوم التوصيل ({selectedCity}):</span>
              <span>{deliveryFee} جنيه</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>المجموع الكلي:</span>
              <span>{total} جنيه</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* نموذج بيانات العميل */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold mb-3">بيانات التوصيل</h3>
          
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input
              id="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="أدخل اسمك الكامل"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="أدخل رقم هاتفك"
              type="tel"
            />
          </div>
          
          <div className="space-y-2">
            <Label>المنطقة المختارة</Label>
            <div className="p-2 bg-gray-100 rounded">
              {selectedCity}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* أزرار الإجراءات */}
      <div className="space-y-3">
        <Button
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg"
        >
          {isSubmitting ? 'جاري إرسال الطلب...' : 'إتمام الطلب'}
        </Button>
        
        <Button
          onClick={onClearCart}
          variant="outline"
          className="w-full text-red-600 border-red-300 hover:bg-red-50"
        >
          مسح السلة
        </Button>
      </div>
    </div>
  );
};
