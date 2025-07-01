
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
  const [subCategoryStats, setSubCategoryStats] = useState<any[]>([]);
  const [totalStats, setTotalStats] = useState({
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
        .select(`
          *,
          sub_categories(name, whatsapp_number)
        `)
        .order('created_at', { ascending: false });
      
      if (data) setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({ title: "خطأ في تحميل الطلبات", variant: "destructive" });
    }
  };

  const loadStats = async () => {
    try {
      // جلب إحصائيات الأقسام الفرعية
      const { data: subCategoryData } = await supabase
        .from('orders')
        .select(`
          sub_category_id,
          delivery_fee,
          created_at,
          sub_categories(name)
        `);
      
      if (subCategoryData) {
        const today = new Date().toDateString();
        
        // تجميع الإحصائيات حسب القسم الفرعي
        const statsMap = new Map();
        
        subCategoryData.forEach(order => {
          const subCategoryId = order.sub_category_id;
          const subCategoryName = order.sub_categories?.name || 'غير محدد';
          const isToday = new Date(order.created_at).toDateString() === today;
          const deliveryFee = Number(order.delivery_fee || 0);
          
          if (!statsMap.has(subCategoryId)) {
            statsMap.set(subCategoryId, {
              id: subCategoryId,
              name: subCategoryName,
              totalOrders: 0,
              todayOrders: 0,
              totalRevenue: 0,
              todayRevenue: 0
            });
          }
          
          const stats = statsMap.get(subCategoryId);
          stats.totalOrders += 1;
          stats.totalRevenue += deliveryFee;
          
          if (isToday) {
            stats.todayOrders += 1;
            stats.todayRevenue += deliveryFee;
          }
        });
        
        setSubCategoryStats(Array.from(statsMap.values()));
        
        // حساب الإحصائيات الإجمالية
        const totalOrders = subCategoryData.length;
        const todayOrders = subCategoryData.filter(order => 
          new Date(order.created_at).toDateString() === today
        ).length;
        const totalDeliveryRevenue = subCategoryData.reduce((sum, order) => 
          sum + Number(order.delivery_fee || 0), 0
        );
        const todayDeliveryRevenue = subCategoryData
          .filter(order => new Date(order.created_at).toDateString() === today)
          .reduce((sum, order) => sum + Number(order.delivery_fee || 0), 0);
        
        setTotalStats({
          totalOrders,
          todayOrders,
          totalDeliveryRevenue,
          todayDeliveryRevenue
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

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">الإحصائيات والطلبات</h1>
      </div>

      {/* الإحصائيات الإجمالية */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">إجمالي الطلبات</h3>
              <p className="text-3xl font-bold text-blue-600">{totalStats.totalOrders}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">طلبات اليوم</h3>
              <p className="text-3xl font-bold text-green-600">{totalStats.todayOrders}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">إجمالي أرباح التوصيل</h3>
              <p className="text-3xl font-bold text-purple-600">{totalStats.totalDeliveryRevenue.toFixed(2)} جنيه</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">أرباح التوصيل اليوم</h3>
              <p className="text-3xl font-bold text-orange-600">{totalStats.todayDeliveryRevenue.toFixed(2)} جنيه</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* إحصائيات الأقسام الفرعية */}
      <Card>
        <CardHeader>
          <CardTitle>إحصائيات الأقسام الفرعية</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم القسم</TableHead>
                <TableHead>إجمالي الطلبات</TableHead>
                <TableHead>طلبات اليوم</TableHead>
                <TableHead>إجمالي الأرباح</TableHead>
                <TableHead>أرباح اليوم</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subCategoryStats.map((stat) => (
                <TableRow key={stat.id}>
                  <TableCell className="font-medium">{stat.name}</TableCell>
                  <TableCell>{stat.totalOrders}</TableCell>
                  <TableCell>{stat.todayOrders}</TableCell>
                  <TableCell>{stat.totalRevenue.toFixed(2)} جنيه</TableCell>
                  <TableCell>{stat.todayRevenue.toFixed(2)} جنيه</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
                <TableHead>القسم</TableHead>
                <TableHead>رسوم التوصيل</TableHead>
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
                  <TableCell>{order.sub_categories?.name || 'غير محدد'}</TableCell>
                  <TableCell>{Number(order.delivery_fee || 0).toFixed(2)} جنيه</TableCell>
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
                          alert(`تفاصيل الطلب:\n\nالعناصر:\n${items}\n\nالموقع: ${order.customer_location || 'غير محدد'}\n\nإجمالي المبلغ: ${order.total_amount} جنيه\n\nرقم الواتساب: ${order.sub_categories?.whatsapp_number || 'غير محدد'}`);
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
