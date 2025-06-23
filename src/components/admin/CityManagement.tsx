
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
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
    delivery_price: ''
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
      setCities(data || []);
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const cityData = {
        name: formData.name,
        delivery_price: parseFloat(formData.delivery_price)
      };

      if (editingCity) {
        await supabase
          .from('allowed_cities')
          .update(cityData)
          .eq('id', editingCity.id);
        toast({ title: "تم تحديث المنطقة بنجاح" });
      } else {
        await supabase
          .from('allowed_cities')
          .insert([cityData]);
        toast({ title: "تم إضافة المنطقة بنجاح" });
      }

      setFormData({ name: '', delivery_price: '' });
      setShowAddForm(false);
      setEditingCity(null);
      loadCities();
    } catch (error) {
      console.error('Error saving city:', error);
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
  };

  const handleEdit = (city: any) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      delivery_price: city.delivery_price.toString()
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المنطقة؟')) return;

    try {
      await supabase.from('allowed_cities').delete().eq('id', id);
      toast({ title: "تم حذف المنطقة بنجاح" });
      loadCities();
    } catch (error) {
      console.error('Error deleting city:', error);
      toast({ title: "حدث خطأ في الحذف", variant: "destructive" });
    }
  };

  const toggleCityStatus = async (id: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('allowed_cities')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      toast({ title: "تم تحديث حالة المنطقة" });
      loadCities();
    } catch (error) {
      console.error('Error updating city status:', error);
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">إدارة المناطق</h1>
      </div>

      <Button onClick={() => { setShowAddForm(true); setEditingCity(null); }}>
        <Plus className="w-4 h-4 ml-2" />
        إضافة منطقة جديدة
      </Button>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCity ? 'تعديل المنطقة' : 'إضافة منطقة جديدة'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">اسم المنطقة</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسم المنطقة"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">سعر التوصيل (جنيه)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.delivery_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, delivery_price: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingCity ? 'تحديث' : 'إضافة'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); setEditingCity(null); }}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>قائمة المناطق</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cities.map(city => (
              <div key={city.id} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <h4 className="font-semibold">{city.name}</h4>
                  <p className="text-lg font-bold text-green-600">{city.delivery_price} جنيه</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${city.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {city.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleCityStatus(city.id, city.is_active)}>
                    {city.is_active ? 'إيقاف' : 'تفعيل'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(city)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(city.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
