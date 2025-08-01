
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, Trash2, ShoppingBag, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface CartScreenProps {
  cart: any[];
  onUpdateCart: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  selectedSubCategory?: string;
}

export const CartScreen = ({ cart, onUpdateCart, onClearCart, selectedSubCategory }: CartScreenProps) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressWritten, setAddressWritten] = useState(false);
  const { toast } = useToast();

  const subtotal = cart.reduce((sum, item) => {
    // للعروض والطلبات المميزة، لا نحسب السعر في المجموع الفرعي
    if (item.is_offer || item.is_special) {
      return sum;
    }
    return sum + (item.price * item.quantity);
  }, 0);
  const deliveryFee = 0; // سيتم تحديده على الواتساب
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast({
        title: "بيانات مطلوبة",
        description: "يرجى إدخال الاسم ورقم الهاتف",
        variant: "destructive"
      });
      return;
    }

    if (!addressWritten) {
      toast({
        title: "العنوان مطلوب",
        description: "يرجى كتابة العنوان والضغط على 'كتبت العنوان'",
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

    await submitOrder();
  };

  const submitOrder = async () => {
    setIsSubmitting(true);

    try {
      // حفظ الطلب في قاعدة البيانات
      const orderData = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_city: 'غير محدد', // سيتم تحديده على الواتساب
        customer_location: customerAddress,
        items: cart,
        total_amount: total,
        delivery_fee: 0, // سيتم تحديده على الواتساب
        status: 'pending',
        sub_category_id: selectedSubCategory
      };

      console.log('Submitting order with data:', orderData);

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('Error inserting order:', error);
        throw error;
      }

      console.log('Order saved successfully:', data);

      // إرسال الطلب عبر واتساب
      await sendWhatsAppOrder();

      // مسح السلة وإعادة تعيين النموذج
      onClearCart();
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setCustomerNotes('');
      setAddressWritten(false);

      toast({
        title: "تم إرسال الطلب",
        description: "سيتم التواصل معك قريباً لتأكيد الطلب وتحديد رسوم التوصيل",
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
      // الحصول على رقم واتساب واسم القسم الفرعي
      let whatsappNumber = '201024713976'; // الافتراضي
      let subCategoryName = 'قسم عام';
      
      // فحص إذا كان الطلب يحتوي على عروض أو طلبات مميزة
      const hasSpecialItems = cart.some(item => item.is_offer || item.is_special);
      
      if (hasSpecialItems) {
        // للعروض والطلبات المميزة، استخدم الرقم الافتراضي مباشرة
        console.log('Order contains special items, using default WhatsApp number:', whatsappNumber);
        subCategoryName = 'العروض والطلبات المميزة';
      } else if (selectedSubCategory) {
        console.log('Getting WhatsApp number for sub-category:', selectedSubCategory);
        
        const { data: subCategoryData, error } = await supabase
          .from('sub_categories')
          .select('whatsapp_number, name')
          .eq('id', selectedSubCategory)
          .single();
        
        console.log('Sub-category data:', subCategoryData);
        
        if (error) {
          console.error('Error getting sub-category:', error);
        }
        
        if (subCategoryData) {
          if (subCategoryData.whatsapp_number) {
            whatsappNumber = subCategoryData.whatsapp_number;
            console.log('Using sub-category WhatsApp number:', whatsappNumber);
          }
          if (subCategoryData.name) {
            subCategoryName = subCategoryData.name;
          }
        } else {
          console.log('No sub-category data found, using defaults');
        }
      }

      // إنشاء ID فريد للطلب
      const orderId = Date.now().toString().slice(-8);
      const orderTime = new Date().toLocaleString('ar-EG', {
        timeZone: 'Africa/Cairo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // تكوين رسالة الطلب
      let message = `📱 *طلب جديد من Elfahd App*\n\n`;
      message += `🆔 *رقم الطلب:* #${orderId}\n`;
      message += `🕐 *وقت الطلب:* ${orderTime}\n`;
      message += `🏪 *القسم:* ${subCategoryName}\n\n`;
      
      message += `👤 *بيانات العميل:*\n`;
      message += `• الاسم: ${customerName}\n`;
      message += `• الهاتف: ${customerPhone}\n`;
      message += `• العنوان: ${customerAddress}\n`;
      if (customerNotes.trim()) {
        message += `• ملاحظات: ${customerNotes}\n`;
      }
      message += `\n🛒 *تفاصيل الطلب:*\n`;
      
      cart.forEach(item => {
        if (item.is_offer) {
          message += `• 🎁 ${item.name} (عرض خاص`;
          if (item.discount_percentage) {
            message += ` - خصم ${item.discount_percentage}%`;
          }
          message += `) × ${item.quantity} = سعر مميز\n`;
        } else if (item.is_special) {
          message += `• ⭐ ${item.name} × ${item.quantity}\n`;
          if (item.description) {
            message += `  الوصف: ${item.description}\n`;
          }
          if (item.images && item.images.length > 0) {
            message += `  صور مرفقة: ${item.images.length} صورة\n`;
          }
        } else {
          // عرض تفاصيل المنتج مع الحجم والسعر الصحيح
          let productLine = `• ${item.name}`;
          if (item.selectedSize) {
            productLine += ` (${item.selectedSize})`;
          }
          productLine += ` × ${item.quantity}`;
          if (item.price > 0) {
            productLine += ` = ${(item.price * item.quantity).toFixed(2)} جنيه`;
          }
          message += `${productLine}\n`;
          
          if (item.description) {
            message += `  الوصف: ${item.description}\n`;
          }
        }
      });
      
      message += `\n💰 *الملخص المالي:*\n`;
      message += `• المجموع الفرعي: ${subtotal > 0 ? `${subtotal.toFixed(2)} جنيه` : 'سعر مميز'}\n`;
      message += `• رسوم التوصيل: سيتم تحديدها حسب المنطقة\n`;
      message += `• المجموع النهائي: ${subtotal > 0 ? `${subtotal.toFixed(2)} جنيه + رسوم التوصيل` : 'سعر مميز + رسوم التوصيل'}\n\n`;
      
      message += `📞 *للاستفسار أو المتابعة:*\n`;
      message += `• خدمة العملاء: 201204486263\n`;
      message += `• اذكر رقم الطلب: #${orderId}\n\n`;
      message += `📝 *ملاحظة:* يرجى تأكيد الطلب وتحديد رسوم التوصيل حسب المنطقة`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      console.log('Opening WhatsApp URL:', whatsappUrl);
      window.open(whatsappUrl, '_blank');

    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }
  };

  const handleAddressWritten = () => {
    if (!customerAddress.trim()) {
      toast({
        title: "العنوان فارغ",
        description: "يرجى كتابة العنوان أولاً",
        variant: "destructive"
      });
      return;
    }
    setAddressWritten(true);
    toast({
      title: "تم تأكيد العنوان",
      description: "يمكنك الآن إتمام الطلب",
    });
  };

  if (cart.length === 0) {
    return (
      <div className="p-4 text-center">
        <ShoppingBag className="w-16 h-16 text-purple-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">السلة فارغة</h2>
        <p className="text-gray-500">لم تقم بإضافة أي منتجات من Elfahd App بعد</p>
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
                  <h3 className="font-semibold flex items-center">
                    {item.is_offer && <span className="text-orange-500 mr-2">🎁</span>}
                    {item.is_special && <span className="text-purple-500 mr-2">⭐</span>}
                    {item.name}
                  </h3>
                  {item.is_offer || item.is_special ? (
                    <p className="text-blue-600 font-bold">سعر مميز - سيتم تحديده في المحادثة</p>
                  ) : (
                    <p className="text-green-600 font-bold">{item.price} جنيه</p>
                  )}
                  {item.description && (
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  )}
                  {item.discount_percentage && (
                    <p className="text-orange-600 text-sm font-bold">خصم {item.discount_percentage}%</p>
                  )}
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
                {item.is_offer || item.is_special ? (
                  <span className="font-semibold text-blue-600">سعر مميز</span>
                ) : (
                  <span className="font-semibold">المجموع: {item.price * item.quantity} جنيه</span>
                )}
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
              <span>{subtotal > 0 ? `${subtotal} جنيه` : 'سعر مميز'}</span>
            </div>
            <div className="flex justify-between">
              <span>رسوم التوصيل:</span>
              <span>سيتم تحديدها على الواتساب</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>المجموع:</span>
              <span>{subtotal > 0 ? `${subtotal} جنيه + رسوم التوصيل` : 'سعر مميز + رسوم التوصيل'}</span>
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
            <Label htmlFor="address">العنوان التفصيلي</Label>
            <Textarea
              id="address"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="أدخل عنوانك التفصيلي (الشارع، المنطقة، معالم مميزة)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
            <Textarea
              id="notes"
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="أي ملاحظات إضافية للطلب..."
              rows={2}
            />
          </div>

          <Button
            onClick={handleAddressWritten}
            variant={addressWritten ? "default" : "outline"}
            className={`w-full ${addressWritten ? 'bg-green-600 hover:bg-green-700' : ''}`}
            disabled={!customerAddress.trim()}
          >
            <MapPin className="w-4 h-4 mr-2" />
            {addressWritten ? '✓ تم تأكيد العنوان' : 'كتبت العنوان'}
          </Button>

          {/* عرض معلومات القسم الفرعي للتأكد */}
          {selectedSubCategory && (
            <div className="space-y-2">
              <Label>معرف القسم الفرعي</Label>
              <div className="p-2 bg-blue-50 rounded text-sm">
                {selectedSubCategory}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* أزرار الإجراءات */}
      <div className="space-y-3">
        <Button
          onClick={handleSubmitOrder}
          disabled={isSubmitting || !addressWritten}
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
