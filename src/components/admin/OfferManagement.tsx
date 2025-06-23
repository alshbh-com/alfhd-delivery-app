
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
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
    discount_percentage: '',
    image_url: '',
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
      setOffers(data || []);
    } catch (error) {
      console.error('Error loading offers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const offerData = {
        title: formData.title,
        description: formData.description,
        discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
        image_url: formData.image_url,
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null
      };

      if (editingOffer) {
        await supabase
          .from('offers')
          .update(offerData)
          .eq('id', editingOffer.id);
        toast({ title: "تم تحديث العرض بنجاح" });
      } else {
        await supabase
          .from('offers')
          .insert([offerData]);
        toast({ title: "تم إضافة العرض بنجاح" });
      }

      setFormData({ title: '', description: '', discount_percentage: '', image_url: '', valid_until: '' });
      setShowAddForm(false);
      setEditingOffer(null);
      loadOffers();
    } catch (error) {
      console.error('Error saving offer:', error);
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
  };

  const handleEdit = (offer: any) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description || '',
      discount_percentage: offer.discount_percentage?.toString() || '',
      image_url: offer.image_url || '',
      valid_until: offer.valid_until ? new Date(offer.valid_until).toISOString().split('T')[0] : ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العرض؟')) return;

    try {
      await supabase.from('offers').delete().eq('id', id);
      toast({ title: "تم حذف العرض بنجاح" });
      loadOffers();
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast({ title: "حدث خطأ في الحذف", variant: "destructive" });
    }
  };

  const toggleOfferStatus = async (id: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('offers')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      toast({ title: "تم تحديث حالة العرض" });
      loadOffers();
    } catch (error) {
      console.error('Error updating offer status:', error);
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
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

      <Button onClick={() => { setShowAddForm(true); setEditingOffer(null); }}>
        <Plus className="w-4 h-4 ml-2" />
        إضافة عرض جديد
      </Button>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingOffer ? 'تعديل العرض' : 'إضافة عرض جديد'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان العرض</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="أدخل عنوان العرض"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">وصف العرض</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="أدخل وصف العرض"
                />
              </div>

              <div>
                <Label htmlFor="discount">نسبة الخصم (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: e.target.value }))}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="valid_until">صالح حتى</Label>
                <Input
                  id="valid_until"
                  type="date"
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

              <div className="flex gap-2">
                <Button type="submit">
                  {editingOffer ? 'تحديث' : 'إضافة'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); setEditingOffer(null); }}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>قائمة العروض</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {offers.map(offer => (
              <div key={offer.id} className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center gap-4">
                  {offer.image_url && (
                    <img src={offer.image_url} alt={offer.title} className="w-16 h-16 object-cover rounded" />
                  )}
                  <div>
                    <h4 className="font-semibold">{offer.title}</h4>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                    {offer.discount_percentage && (
                      <p className="text-lg font-bold text-red-600">خصم {offer.discount_percentage}%</p>
                    )}
                    {offer.valid_until && (
                      <p className="text-xs text-gray-500">
                        صالح حتى: {new Date(offer.valid_until).toLocaleDateString('ar-EG')}
                      </p>
                    )}
                    <span className={`inline-block px-2 py-1 text-xs rounded ${offer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {offer.is_active ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleOfferStatus(offer.id, offer.is_active)}>
                    {offer.is_active ? 'إيقاف' : 'تفعيل'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(offer)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(offer.id)}>
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
