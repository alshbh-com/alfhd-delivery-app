
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
  const [sharedOrderCode, setSharedOrderCode] = useState('');
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

    // فحص صحة كود التوصيل المشترك إذا تم إدخاله
    if (sharedOrderCode.trim()) {
      const isValidCode = await validateSharedOrder(sharedOrderCode.trim());
      if (!isValidCode) {
        return; // سيتم عرض رسالة الخطأ في دالة validateSharedOrder
      }
    }

    await submitOrder();
  };

  const validateSharedOrder = async (code: string) => {
    try {
      // البحث عن طلب مطابق بالكود المشترك
      const { data: existingOrder, error } = await supabase
        .from('orders')
        .select('id, created_at, shared_code')
        .eq('shared_code', code.toUpperCase())
        .eq('status', 'pending')
        .maybeSingle();

      if (error || !existingOrder) {
        toast({
          title: "كود غير صحيح",
          description: "لم يتم العثور على طلب مطابق لهذا الكود",
          variant: "destructive"
        });
        return false;
      }

      // فحص إذا كان الطلب قديم (أكثر من ساعة)
      const orderTime = new Date(existingOrder.created_at);
      const currentTime = new Date();
      const timeDifference = (currentTime.getTime() - orderTime.getTime()) / (1000 * 60 * 60); // بالساعات

      if (timeDifference > 1) {
        toast({
          title: "انتهت صلاحية الكود",
          description: "لا يمكن الانضمام للطلب بعد مرور ساعة على إنشائه",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "تم التحقق بنجاح",
        description: "سيتم إضافة طلبك للتوصيل المشترك",
      });
      return true;

    } catch (error) {
      console.error('Error validating shared order:', error);
      toast({
        title: "خطأ في التحقق",
        description: "حدث خطأ أثناء التحقق من الكود",
        variant: "destructive"
      });
      return false;
    }
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
      await sendWhatsAppOrder(data.shared_code);

      // مسح السلة وإعادة تعيين النموذج
      onClearCart();
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setCustomerNotes('');
      setSharedOrderCode('');
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

  const sendWhatsAppOrder = async (orderSharedCode?: string) => {
    try {
      // الحصول على أسماء الأقسام الفرعية
      const subCategoryIds = [...new Set(cart.map(item => item.sub_category_id).filter(id => id))];
      const subCategories = new Map();
      
      // جلب أسماء الأقسام الفرعية من قاعدة البيانات
      if (subCategoryIds.length > 0) {
        const { data: subCategoriesData } = await supabase
          .from('sub_categories')
          .select('id, name, whatsapp_number')
          .in('id', subCategoryIds);
        
        if (subCategoriesData) {
          subCategoriesData.forEach(cat => {
            subCategories.set(cat.id, cat);
          });
        }
      }

      // تحديد رقم الواتساب (استخدام الرقم الافتراضي إذا كان هناك منتجات من أقسام متعددة)
      let whatsappNumber = '201024713976'; // الرقم الافتراضي
      
      // إذا كان كل المنتجات من قسم واحد فقط، استخدم رقم ذلك القسم
      if (subCategoryIds.length === 1 && !cart.some(item => item.is_offer || item.is_special)) {
        const singleSubCategory = subCategories.get(subCategoryIds[0]);
        if (singleSubCategory?.whatsapp_number) {
          whatsappNumber = singleSubCategory.whatsapp_number;
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
      if (orderSharedCode) {
        message += `🔗 *كود المشاركة:* ${orderSharedCode}\n`;
      }
      message += `🕐 *وقت الطلب:* ${orderTime}\n\n`;
      
      message += `👤 *بيانات العميل:*\n`;
      message += `• الاسم: ${customerName}\n`;
      message += `• الهاتف: ${customerPhone}\n`;
      message += `• العنوان: ${customerAddress}\n`;
      if (sharedOrderCode.trim()) {
        message += `• 🚚 توصيل مشترك مع الطلب: #${sharedOrderCode.toUpperCase()}\n`;
      }
      if (customerNotes.trim()) {
        message += `• ملاحظات: ${customerNotes}\n`;
      }
      message += `\n🛒 *تفاصيل الطلب:*\n`;
      
      // تجميع المنتجات حسب الأقسام
      const itemsByCategory = new Map();
      
      cart.forEach(item => {
        let categoryKey;
        let categoryName;
        
        if (item.is_offer) {
          categoryKey = 'offers';
          categoryName = '🎁 العروض الخاصة';
        } else if (item.is_special) {
          categoryKey = 'special';
          categoryName = '⭐ الطلبات المميزة';
        } else if (item.sub_category_id) {
          categoryKey = item.sub_category_id;
          categoryName = subCategories.get(item.sub_category_id)?.name || 'قسم غير محدد';
        } else {
          categoryKey = 'general';
          categoryName = 'منتجات عامة';
        }
        
        if (!itemsByCategory.has(categoryKey)) {
          itemsByCategory.set(categoryKey, {
            name: categoryName,
            items: []
          });
        }
        
        itemsByCategory.get(categoryKey).items.push(item);
      });
      
      // عرض المنتجات مجمعة حسب الأقسام
      itemsByCategory.forEach((category) => {
        message += `\n🏪 *${category.name}:*\n`;
        
        category.items.forEach(item => {
          if (item.is_offer) {
            message += `• ${item.name} (عرض خاص`;
            if (item.discount_percentage) {
              message += ` - خصم ${item.discount_percentage}%`;
            }
            message += `) × ${item.quantity} = سعر مميز\n`;
          } else if (item.is_special) {
            message += `• ${item.name} × ${item.quantity}`;
            if (item.price > 0) {
              message += ` - ${item.price} جنيه للقطعة`;
            }
            message += `\n`;
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
            if (item.price > 0) {
              productLine += ` - ${item.price} جنيه للقطعة`;
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
      });
      
      message += `\n💰 *الملخص المالي:*\n`;
      message += `• المجموع الفرعي: ${subtotal > 0 ? `${subtotal.toFixed(2)} جنيه` : 'سعر مميز'}\n`;
      message += `• رسوم التوصيل: سيتم تحديدها حسب المنطقة\n`;
      message += `• المجموع النهائي: ${subtotal > 0 ? `${subtotal.toFixed(2)} جنيه + رسوم التوصيل` : 'سعر مميز + رسوم التوصيل'}\n\n`;
      
      message += `📞 *للاستفسار أو المتابعة:*\n`;
      message += `• خدمة العملاء: 201024713976\n`;
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
            <Label htmlFor="sharedOrderCode">كود التوصيل المشترك (اختياري)</Label>
            <Input
              id="sharedOrderCode"
              value={sharedOrderCode}
              onChange={(e) => setSharedOrderCode(e.target.value)}
              placeholder="أدخل كود صديقك للانضمام لنفس التوصيلة"
            />
            <p className="text-xs text-gray-500">
              إذا كان لديك صديق طلب قبلك بأقل من ساعة، يمكنك إدخال كود طلبه للتوصيل المشترك
            </p>
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
