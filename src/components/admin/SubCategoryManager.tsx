
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Phone, Power, PowerOff, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface SubCategoryManagerProps {
  onBack: () => void;
}

export const SubCategoryManager = ({ onBack }: SubCategoryManagerProps) => {
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    whatsapp_number: '',
    is_open: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSubCategories();
  }, []);

  const loadSubCategories = async () => {
    try {
      const { data } = await supabase
        .from('sub_categories')
        .select('*, main_categories(name)')
        .order('name');
      
      if (data) setSubCategories(data);
    } catch (error) {
      console.error('Error loading sub categories:', error);
      toast({ title: "خطأ في تحميل البيانات", variant: "destructive" });
    }
  };

  const handleEdit = (subCategory: any) => {
    setEditingId(subCategory.id);
    setEditData({
      whatsapp_number: subCategory.whatsapp_number || '',
      is_open: subCategory.is_open ?? true
    });
  };

  const handleSave = async (id: string) => {
    try {
      await supabase
        .from('sub_categories')
        .update(editData)
        .eq('id', id);
      
      toast({ title: "تم التحديث بنجاح" });
      setEditingId(null);
      loadSubCategories();
    } catch (error) {
      console.error('Error updating sub category:', error);
      toast({ title: "حدث خطأ في التحديث", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف القسم "${name}"؟\n\nسيتم حذف جميع المنتجات والطلبات المرتبطة بهذا القسم.`)) {
      return;
    }

    try {
      // أولاً احذف جميع المنتجات المرتبطة بهذا القسم
      await supabase
        .from('products')
        .delete()
        .eq('sub_category_id', id);

      // ثم احذف جميع الطلبات المرتبطة بهذا القسم
      await supabase
        .from('orders')
        .delete()
        .eq('sub_category_id', id);

      // أخيراً احذف القسم الفرعي نفسه
      await supabase
        .from('sub_categories')
        .delete()
        .eq('id', id);

      toast({ title: "تم حذف القسم وجميع البيانات المرتبطة به بنجاح" });
      loadSubCategories();
    } catch (error) {
      console.error('Error deleting sub category:', error);
      toast({ title: "حدث خطأ في الحذف", variant: "destructive" });
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('sub_categories')
        .update({ is_open: !currentStatus })
        .eq('id', id);
      
      toast({ 
        title: !currentStatus ? "تم فتح القسم" : "تم إغلاق القسم" 
      });
      loadSubCategories();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إدارة الأقسام الفرعية</h1>
        <Button variant="outline" onClick={onBack}>
          رجوع
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>أرقام الواتساب وحالة الأقسام</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم القسم</TableHead>
                <TableHead>القسم الرئيسي</TableHead>
                <TableHead>رقم الواتساب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subCategories.map((subCategory) => (
                <TableRow key={subCategory.id}>
                  <TableCell>{subCategory.name}</TableCell>
                  <TableCell>{subCategory.main_categories?.name}</TableCell>
                  <TableCell>
                    {editingId === subCategory.id ? (
                      <Input
                        value={editData.whatsapp_number}
                        onChange={(e) => setEditData(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                        placeholder="رقم الواتساب"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {subCategory.whatsapp_number || 'غير محدد'}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === subCategory.id ? (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editData.is_open}
                          onCheckedChange={(checked) => setEditData(prev => ({ ...prev, is_open: checked }))}
                        />
                        <span>{editData.is_open ? 'مفتوح' : 'مغلق'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {subCategory.is_open ? (
                          <Power className="w-4 h-4 text-green-600" />
                        ) : (
                          <PowerOff className="w-4 h-4 text-red-600" />
                        )}
                        <span className={subCategory.is_open ? 'text-green-600' : 'text-red-600'}>
                          {subCategory.is_open ? 'مفتوح' : 'مغلق'}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingId === subCategory.id ? (
                        <>
                          <Button size="sm" onClick={() => handleSave(subCategory.id)}>
                            حفظ
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                            إلغاء
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(subCategory)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={subCategory.is_open ? "destructive" : "default"}
                            onClick={() => toggleStatus(subCategory.id, subCategory.is_open)}
                          >
                            {subCategory.is_open ? (
                              <PowerOff className="w-4 h-4" />
                            ) : (
                              <Power className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(subCategory.id, subCategory.name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
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
