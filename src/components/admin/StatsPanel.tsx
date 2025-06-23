
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface StatsPanelProps {
  onBack: () => void;
}

export const StatsPanel = ({ onBack }: StatsPanelProps) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
    loadStats();
  }, []);

  const loadOrders = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({ title: "خطأ في تحميل الطلبات", variant: "destructive" });
    }
  };

  const loadStats = async () => {
    try {
      const { data: allOrders } = await supabase
        .from('orders')
        .select('total_amount, created_at');
      
      if (allOrders) {
        const today = new Date().toDateString();
        const todayOrders = allOrders.filter(order => 
          new Date(order.created_at).toDateString() === today
        );
        
        setStats({
          totalOrders: allOrders.length,
          todayOrders: todayOrders.length,
          totalRevenue: allOrders.reduce((sum, order) => sum + Number(order.total_amount), 0),
          todayRevenue: todayOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      toast({ title: "تم حذف الطلب بنجاح" });
      loadOrders();
      loadStats();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({ title: "حدث خطأ في الحذف", variant: "destructive" });
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
      toast({ title: "حدث خطأ في التحديث", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'confirmed': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'confirmed': return 'مؤكد';
      case 'completed': return 'مكتمل';
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

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">إجمالي الطلبات</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">طلبات اليوم</h3>
              <p className="text-3xl font-bold text-green-600">{stats.todayOrders}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">إجمالي الأرباح</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.totalRevenue.toFixed(2)} جنيه</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">أرباح اليوم</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.todayRevenue.toFixed(2)} جنيه</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول الطلبات */}
      <Card>
        <CardHeader>
          <CardTitle>إدارة الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الطلب</TableHead>
                <TableHead>اسم العميل</TableHead>
                <TableHead>الهاتف</TableHead>
                <TableHead>المنطقة</TableHead>
                <TableHead>المبلغ الإجمالي</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order.customer_phone}</TableCell>
                  <TableCell>{order.customer_city}</TableCell>
                  <TableCell>{Number(order.total_amount).toFixed(2)} جنيه</TableCell>
                  <TableCell>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`p-1 border rounded text-sm ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">في الانتظار</option>
                      <option value="confirmed">مؤكد</option>
                      <option value="completed">مكتمل</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString('ar-EG')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const items = JSON.stringify(order.items, null, 2);
                          alert(`تفاصيل الطلب:\n\nالعناصر:\n${items}\n\nالموقع: ${order.customer_location || 'غير محدد'}`);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
