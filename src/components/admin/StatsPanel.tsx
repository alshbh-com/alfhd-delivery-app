
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Trash2, BarChart3, DollarSign, ShoppingCart, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface StatsPanelProps {
  onBack: () => void;
}

export const StatsPanel = ({ onBack }: StatsPanelProps) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
    calculateStats();
  }, []);

  const loadOrders = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const calculateStats = async () => {
    try {
      const { data: allOrders } = await supabase
        .from('orders')
        .select('delivery_fee, created_at');

      const today = new Date().toDateString();
      
      if (allOrders) {
        const totalOrders = allOrders.length;
        const totalRevenue = allOrders.reduce((sum, order) => sum + Number(order.delivery_fee), 0);
        
        const todayOrders = allOrders.filter(order => 
          new Date(order.created_at).toDateString() === today
        );
        const todayOrdersCount = todayOrders.length;
        const todayRevenue = todayOrders.reduce((sum, order) => sum + Number(order.delivery_fee), 0);

        setStats({
          totalOrders,
          totalRevenue,
          todayOrders: todayOrdersCount,
          todayRevenue
        });
      }
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const deleteAllOrders = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع الطلبات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return;
    }

    try {
      await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      toast({ title: "تم حذف جميع الطلبات بنجاح" });
      setOrders([]);
      setStats({ totalOrders: 0, totalRevenue: 0, todayOrders: 0, todayRevenue: 0 });
    } catch (error) {
      console.error('Error deleting orders:', error);
      toast({ title: "حدث خطأ في حذف الطلبات", variant: "destructive" });
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;

    try {
      await supabase.from('orders').delete().eq('id', orderId);
      toast({ title: "تم حذف الطلب بنجاح" });
      loadOrders();
      calculateStats();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({ title: "حدث خطأ في حذف الطلب", variant: "destructive" });
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      toast({ title: "تم تحديث حالة الطلب" });
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-EG');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'confirmed': return 'مؤكد';
      case 'preparing': return 'قيد التحضير';
      case 'delivered': return 'تم التوصيل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">الإحصائيات والطلبات</h1>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">إجمالي الأرباح</p>
                <p className="text-2xl font-bold">{stats.totalRevenue} ج</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">طلبات اليوم</p>
                <p className="text-2xl font-bold">{stats.todayOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">أرباح اليوم</p>
                <p className="text-2xl font-bold">{stats.todayRevenue} ج</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أزرار الإجراءات */}
      <div className="flex gap-2 mb-4">
        <Button
          onClick={deleteAllOrders}
          variant="destructive"
          className="bg-red-600 hover:bg-red-700"
        >
          <Trash2 className="w-4 h-4 ml-2" />
          حذف جميع الطلبات
        </Button>
      </div>

      {/* جدول الطلبات */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">لا توجد طلبات حتى الآن</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>اسم العميل</TableHead>
                    <TableHead>رقم الهاتف</TableHead>
                    <TableHead>المنطقة</TableHead>
                    <TableHead>المبلغ الكلي</TableHead>
                    <TableHead>رسوم التوصيل</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        {order.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.customer_phone}</TableCell>
                      <TableCell>{order.customer_city}</TableCell>
                      <TableCell className="font-bold">{order.total_amount} ج</TableCell>
                      <TableCell className="font-bold text-green-600">{order.delivery_fee} ج</TableCell>
                      <TableCell>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`px-2 py-1 text-xs rounded ${getStatusColor(order.status)}`}
                        >
                          <option value="pending">قيد الانتظار</option>
                          <option value="confirmed">مؤكد</option>
                          <option value="preparing">قيد التحضير</option>
                          <option value="delivered">تم التوصيل</option>
                          <option value="cancelled">ملغي</option>
                        </select>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteOrder(order.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
