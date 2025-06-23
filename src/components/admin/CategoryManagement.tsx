
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Edit, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface CategoryManagementProps {
  onBack: () => void;
}

export const CategoryManagement = ({ onBack }: CategoryManagementProps) => {
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formType, setFormType] = useState<'main' | 'sub'>('main');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    main_category_id: '',
    sort_order: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data: mainCats } = await supabase
        .from('main_categories')
        .select('*')
        .order('sort_order');
      
      const { data: subCats } = await supabase
        .from('sub_categories')
        .select('*, main_categories(name)')
        .order('sort_order');

      setMainCategories(mainCats || []);
      setSubCategories(subCats || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // تحديث موجود
        if (formType === 'main') {
          await supabase
            .from('main_categories')
            .update({
              name: formData.name,
              description: formData.description,
              image_url: formData.image_url,
              sort_order: formData.sort_order
            })
            .eq('id', editingCategory.id);
        } else {
          await supabase
            .from('sub_categories')
            .update({
              name: formData.name,
              description: formData.description,
              image_url: formData.image_url,
              main_category_id: formData.main_category_id,
              sort_order: formData.sort_order
            })
            .eq('id', editingCategory.id);
        }
        toast({ title: "تم التحديث بنجاح" });
      } else {
        // إضافة جديد
        if (formType === 'main') {
          await supabase
            .from('main_categories')
            .insert([{
              name: formData.name,
              description: formData.description,
              image_url: formData.image_url,
              sort_order: formData.sort_order
            }]);
        } else {
          await supabase
            .from('sub_categories')
            .insert([{
              name: formData.name,
              description: formData.description,
              image_url: formData.image_url,
              main_category_id: formData.main_category_id,
              sort_order: formData.sort_order
            }]);
        }
        toast({ title: "تم الإضافة بنجاح" });
      }

      setFormData({ name: '', description: '', image_url: '', main_category_id: '', sort_order: 0 });
      setShowAddForm(false);
      setEditingCategory(null);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
  };

  const handleEdit = (category: any, type: 'main' | 'sub') => {
    setEditingCategory(category);
    setFormType(type);
    setFormData({
      name: category.name,
      description: category.description || '',
      image_url: category.image_url || '',
      main_category_id: category.main_category_id || '',
      sort_order: category.sort_order || 0
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string, type: 'main' | 'sub') => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;

    try {
      if (type === 'main') {
        await supabase.from('main_categories').delete().eq('id', id);
      } else {
        await supabase.from('sub_categories').delete().eq('id', id);
      }
      toast({ title: "تم الحذف بنجاح" });
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({ title: "حدث خطأ في الحذف", variant: "destructive" });
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
        <h1 className="text-2xl font-bold text-gray-800">إدارة الأقسام</h1>
      </div>

      <div className="flex gap-2 mb-4">
        <Button onClick={() => { setFormType('main'); setShowAddForm(true); setEditingCategory(null); }}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة قسم رئيسي
        </Button>
        <Button onClick={() => { setFormType('sub'); setShowAddForm(true); setEditingCategory(null); }}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة قسم فرعي
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCategory ? 'تعديل' : 'إضافة'} {formType === 'main' ? 'قسم رئيسي' : 'قسم فرعي'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">اسم القسم</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسم القسم"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="أدخل وصف القسم"
                />
              </div>

              {formType === 'sub' && (
                <div>
                  <Label htmlFor="main_category">القسم الرئيسي</Label>
                  <select
                    id="main_category"
                    value={formData.main_category_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, main_category_id: e.target.value }))}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">اختر القسم الرئيسي</option>
                    {mainCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <Label htmlFor="sort_order">ترتيب العرض</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                />
              </div>

              <div>
                <Label htmlFor="image">صورة القسم</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingCategory ? 'تحديث' : 'إضافة'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); setEditingCategory(null); }}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* الأقسام الرئيسية */}
      <Card>
        <CardHeader>
          <CardTitle>الأقسام الرئيسية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mainCategories.map(category => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {category.image_url && (
                    <img src={category.image_url} alt={category.name} className="w-12 h-12 object-cover rounded" />
                  )}
                  <div>
                    <h4 className="font-semibold">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(category, 'main')}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(category.id, 'main')}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* الأقسام الفرعية */}
      <Card>
        <CardHeader>
          <CardTitle>الأقسام الفرعية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {subCategories.map(category => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {category.image_url && (
                    <img src={category.image_url} alt={category.name} className="w-12 h-12 object-cover rounded" />
                  )}
                  <div>
                    <h4 className="font-semibold">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                    <p className="text-xs text-blue-600">القسم الرئيسي: {category.main_categories?.name}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(category, 'sub')}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(category.id, 'sub')}>
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
