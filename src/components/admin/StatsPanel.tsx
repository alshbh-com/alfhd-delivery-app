
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Trash2, Eye, TrendingUp, Package, DollarSign, Calendar } from 'lucide-react';
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
    totalDeliveryRevenue: 0,
    todayDeliveryRevenue: 0
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
        .select('delivery_fee, created_at');
      
      if (allOrders) {
        const today = new Date().toDateString();
        const todayOrders = allOrders.filter(order => 
          new Date(order.created_at).toDateString() === today
        );
        
        setStats({
          totalOrders: allOrders.length,
          todayOrders: todayOrders.length,
          totalDeliveryRevenue: allOrders.reduce((sum, order) => sum + Number(order.delivery_fee || 0), 0),
          todayDeliveryRevenue: todayOrders.reduce((sum, order) => sum + Number(order.delivery_fee || 0), 0)
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
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'confirmed': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
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
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={onBack} className="hover:bg-orange-50">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 arabic-text">الإحصائيات والطلبات</h1>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="talabat-card hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 arabic-text">إجمالي الطلبات</h3>
              <p className="text-4xl font-bold text-blue-600">{stats.totalOrders}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="talabat-card hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 arabic-text">طلبات اليوم</h3>
              <p className="text-4xl font-bold text-green-600">{stats.todayOrders}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="talabat-card hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 arabic-text">إجمالي أرباح التوصيل</h3>
              <p className="text-4xl font-bold text-purple-600">{stats.totalDeliveryRevenue.toFixed(2)} جنيه</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="talabat-card hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 arabic-text">أرباح التوصيل اليوم</h3>
              <p className="text-4xl font-bold text-orange-600">{stats.todayDeliveryRevenue.toFixed(2)} جنيه</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول الطلبات */}
      <Card className="talabat-card">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-2xl">
          <CardTitle className="text-2xl arabic-text">إدارة الطلبات</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-right font-bold">رقم الطلب</TableHead>
                  <TableHead className="text-right font-bold">اسم العميل</TableHead>
                  <TableHead className="text-right font-bold">الهاتف</TableHead>
                  <TableHead className="text-right font-bold">المنطقة</TableHead>
                  <TableHead className="text-right font-bold">رسوم التوصيل</TableHead>
                  <TableHead className="text-right font-bold">الحالة</TableHead>
                  <TableHead className="text-right font-bold">التاريخ</TableHead>
                  <TableHead className="text-right font-bold">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-mono text-sm font-medium">#{order.id.slice(0, 8)}</TableCell>
                    <TableCell className="font-semibold">{order.customer_name}</TableCell>
                    <TableCell className="text-blue-600">{order.customer_phone}</TableCell>
                    <TableCell className="font-medium">{order.customer_city}</TableCell>
                    <TableCell className="font-bold text-green-600">{Number(order.delivery_fee || 0).toFixed(2)} جنيه</TableCell>
                    <TableCell>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`p-2 border-2 rounded-lg text-sm font-medium ${getStatusColor(order.status)} transition-all duration-200`}
                      >
                        <option value="pending">في الانتظار</option>
                        <option value="confirmed">مؤكد</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('ar-EG')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-blue-50 hover:border-blue-300"
                          onClick={() => {
                            const items = JSON.stringify(order.items, null, 2);
                            alert(`تفاصيل الطلب:\n\nالعناصر:\n${items}\n\nالموقع: ${order.customer_location || 'غير محدد'}\n\nالمبلغ الإجمالي: ${order.total_amount} جنيه`);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="hover:bg-red-600"
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
