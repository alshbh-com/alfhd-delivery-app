import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Clock, CheckCircle, XCircle, Copy, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  total_amount: number;
  delivery_fee: number;
  status: string;
  created_at: string;
  shared_code: string;
  items: any;
}

interface OrderManagementProps {
  onBack: () => void;
}

export function OrderManagement({ onBack }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الطلبات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الطلب بنجاح"
      });

      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة الطلب",
        variant: "destructive"
      });
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف الطلب بنجاح"
      });

      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الطلب",
        variant: "destructive"
      });
    }
  };

  const copySharedCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "تم النسخ",
      description: "تم نسخ الكود المشترك"
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order =>
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_phone.includes(searchTerm) ||
    order.shared_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'قيد الانتظار', variant: 'secondary' as const },
      confirmed: { label: 'مؤكد', variant: 'default' as const },
      preparing: { label: 'قيد التحضير', variant: 'default' as const },
      ready: { label: 'جاهز', variant: 'default' as const },
      delivered: { label: 'تم التوصيل', variant: 'default' as const },
      cancelled: { label: 'ملغي', variant: 'destructive' as const }
    };

    return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
  };

  if (loading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-bold">إدارة الطلبات</h2>
        </div>
        <Button onClick={fetchOrders} variant="outline">
          تحديث
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="البحث بالاسم، الهاتف، أو الكود المشترك..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => {
          const statusInfo = getStatusBadge(order.status);
          
          return (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{order.customer_name}</h3>
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    {order.shared_code && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copySharedCode(order.shared_code)}
                        className="h-6 px-2"
                      >
                        <Copy className="w-3 h-3 ml-1" />
                        {order.shared_code}
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>📞 {order.customer_phone}</div>
                    <div>📍 {order.customer_city}</div>
                    <div>💰 {order.total_amount} جنيه + {order.delivery_fee} توصيل</div>
                    <div>⏰ {format(new Date(order.created_at), 'PPpp', { locale: ar })}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-medium">الأصناف:</div>
                    {order.items?.map((item, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        • {item.name} × {item.quantity}
                        {item.size && ` (${item.size})`}
                        {item.price && ` - ${item.price} جنيه`}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {order.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 ml-1" />
                        تأكيد
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      >
                        <XCircle className="w-4 h-4 ml-1" />
                        إلغاء
                      </Button>
                    </>
                  )}
                  
                  {order.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                    >
                      <Clock className="w-4 h-4 ml-1" />
                      قيد التحضير
                    </Button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                    >
                      جاهز للتوصيل
                    </Button>
                  )}
                  
                  {order.status === 'ready' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                    >
                      تم التوصيل
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteOrder(order.id)}
                  >
                    <Trash2 className="w-4 h-4 ml-1" />
                    حذف
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          لا توجد طلبات
        </div>
      )}
    </div>
  );
}