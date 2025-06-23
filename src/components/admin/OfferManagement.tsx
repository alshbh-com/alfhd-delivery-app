
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface OfferManagementProps {
  onBack: () => void;
}

export const OfferManagement = ({ onBack }: OfferManagementProps) => {
  const [offers, setOffers] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    discount_percentage: 0,
    is_active: true,
    valid_until: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const { data } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setOffers(data);
    } catch (error) {
      console.error('Error loading offers:', error);
      toast({ title: "خطأ في تحميل البيانات", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null
      };

      if (editingOffer) {
        await supabase
          .from('offers')
          .update(submitData)
          .eq('id', editingOffer.id);
        toast({ title: "تم التحديث بنجاح" });
      } else {
        await supabase
          .from('offers')
          .insert([submitData]);
        toast({ title: "تم الإضافة بنجاح" });
      }
      
      resetForm();
      loadOffers();
    } catch (error) {
      console.error('Error saving offer:', error);
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase
        .from('offers')
        .delete()
        .eq('id', id);
      
      toast({ title: "تم الحذف بنجاح" });
      loadOffers();
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast({ title: "حدث خطأ في الحذف", variant: "destructive" });
    }
  };

  const handleEdit = (offer: any) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title || '',
      description: offer.description || '',
      image_url: offer.image_url || '',
      discount_percentage: offer.discount_percentage || 0,
      is_active: offer.is_active ?? true,
      valid_until: offer.valid_until ? new Date(offer.valid_until).toISOString().slice(0, 16) : ''
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      discount_percentage: 0,
      is_active: true,
      valid_until: ''
    });
    setEditingOffer(null);
    setShowAddForm(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, image_url: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">إدارة العروض</h1>
      </div>

      {!showAddForm ? (
        <div className="space-y-6">
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة عرض جديد
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>قائمة العروض</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العنوان</TableHead>
                    <TableHead>نسبة الخصم</TableHead>
                    <TableHead>صالح حتى</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell>{offer.title}</TableCell>
                      <TableCell>{offer.discount_percentage}%</TableCell>
                      <TableCell>
                        {offer.valid_until ? new Date(offer.valid_until).toLocaleDateString('ar-EG') : 'بدون تاريخ انتهاء'}
                      </TableCell>
                      <TableCell>{offer.is_active ? 'نشط' : 'غير نشط'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(offer)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(offer.id)}>
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
              {editingOffer ? 'تعديل العرض' : 'إضافة عرض جديد'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان العرض</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">وصف العرض</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="discount">نسبة الخصم (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: parseFloat(e.target.value) || 0 }))}
                />
              </div>

              <div>
                <Label htmlFor="valid-until">صالح حتى</Label>
                <Input
                  id="valid-until"
                  type="datetime-local"
                  value={formData.valid_until}
                  onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="image">صورة العرض</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                )}
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
                  {editingOffer ? 'تحديث' : 'إضافة'}
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
