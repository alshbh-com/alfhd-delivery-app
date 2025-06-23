
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface CityManagementProps {
  onBack: () => void;
}

export const CityManagement = ({ onBack }: CityManagementProps) => {
  const [cities, setCities] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCity, setEditingCity] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    delivery_price: 0,
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const { data } = await supabase
        .from('allowed_cities')
        .select('*')
        .order('name');
      
      if (data) setCities(data);
    } catch (error) {
      console.error('Error loading cities:', error);
      toast({ title: "خطأ في تحميل البيانات", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCity) {
        await supabase
          .from('allowed_cities')
          .update(formData)
          .eq('id', editingCity.id);
        toast({ title: "تم التحديث بنجاح" });
      } else {
        await supabase
          .from('allowed_cities')
          .insert([formData]);
        toast({ title: "تم الإضافة بنجاح" });
      }
      
      resetForm();
      loadCities();
    } catch (error) {
      console.error('Error saving city:', error);
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase
        .from('allowed_cities')
        .delete()
        .eq('id', id);
      
      toast({ title: "تم الحذف بنجاح" });
      loadCities();
    } catch (error) {
      console.error('Error deleting city:', error);
      toast({ title: "حدث خطأ في الحذف", variant: "destructive" });
    }
  };

  const handleEdit = (city: any) => {
    setEditingCity(city);
    setFormData({
      name: city.name || '',
      delivery_price: city.delivery_price || 0,
      is_active: city.is_active ?? true
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      delivery_price: 0,
      is_active: true
    });
    setEditingCity(null);
    setShowAddForm(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">إدارة المناطق</h1>
      </div>

      {!showAddForm ? (
        <div className="space-y-6">
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة منطقة جديدة
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>قائمة المناطق المسموحة</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم المنطقة</TableHead>
                    <TableHead>رسوم التوصيل</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cities.map((city) => (
                    <TableRow key={city.id}>
                      <TableCell>{city.name}</TableCell>
                      <TableCell>{city.delivery_price} جنيه</TableCell>
                      <TableCell>{city.is_active ? 'نشط' : 'غير نشط'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(city)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(city.id)}>
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCity ? 'تعديل المنطقة' : 'إضافة منطقة جديدة'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">اسم المنطقة</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="delivery-price">رسوم التوصيل (جنيه)</Label>
                <Input
                  id="delivery-price"
                  type="number"
                  step="0.01"
                  value={formData.delivery_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, delivery_price: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="active">نشط</Label>
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="w-4 h-4 ml-2" />
                  {editingCity ? 'تحديث' : 'إضافة'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 ml-2" />
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
