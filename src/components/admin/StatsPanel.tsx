
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingBag, TrendingUp, Trash2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

interface StatsPanelProps {
  onBack: () => void;
}

export const StatsPanel = ({ onBack }: StatsPanelProps) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (orders) {
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.delivery_fee, 0);
        
        setStats({
          totalOrders,
          totalRevenue,
          recentOrders: orders.slice(0, 10)
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllOrders = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع الطلبات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // حذف جميع الطلبات

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف جميع الطلبات بنجاح",
      });

      loadStats(); // إعادة تحميل الإحصائيات
    } catch (error) {
      console.error('Error deleting orders:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الطلبات",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الإحصائيات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">الإحصائيات</h1>
      </div>

      {/* ملخص الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-lg">إجمالي الطلبات</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-lg">إجمالي أرباح التوصيل</h3>
                <p className="text-2xl font-bold text-green-600">{stats.totalRevenue} جنيه</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الطلبات الحديثة */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">الطلبات الحديثة</h3>
            <Button
              onClick={handleDeleteAllOrders}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              حذف جميع الطلبات
            </Button>
          </div>
          
          {stats.recentOrders.length === 0 ? (
            <p className="text-center text-gray-600 py-4">لا توجد طلبات</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order: any) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{order.customer_name}</h4>
                      <p className="text-sm text-gray-600">{order.customer_phone}</p>
                      <p className="text-sm text-gray-600">{order.customer_city}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{order.total_amount} جنيه</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">المنتجات:</p>
                    {order.items.map((item: any, index: number) => (
                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded mr-1">
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
