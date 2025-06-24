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

interface CategoryManagementProps {
  onBack: () => void;
}

export const CategoryManagement = ({ onBack }: CategoryManagementProps) => {
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formType, setFormType] = useState<'main' | 'sub'>('main');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    is_active: true,
    sort_order: 0,
    main_category_id: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      console.log('Loading categories...');
      const { data: mainData, error: mainError } = await supabase
        .from('main_categories')
        .select('*')
        .order('sort_order');
      
      const { data: subData, error: subError } = await supabase
        .from('sub_categories')
        .select('*, main_categories(name)')
        .order('sort_order');
      
      if (mainError) {
        console.error('Error loading main categories:', mainError);
        throw mainError;
      }
      if (subError) {
        console.error('Error loading sub categories:', subError);
        throw subError;
      }
      
      console.log('Main categories loaded:', mainData);
      console.log('Sub categories loaded:', subData);
      
      if (mainData) setMainCategories(mainData);
      if (subData) setSubCategories(subData);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({ title: "خطأ في تحميل البيانات", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      console.log('Form type:', formType);
      
      // إعداد البيانات حسب نوع النموذج
      let submitData;
      if (formType === 'main') {
        // للأقسام الرئيسية - إزالة main_category_id
        submitData = {
          name: formData.name,
          description: formData.description,
          image_url: formData.image_url,
          is_active: formData.is_active,
          sort_order: formData.sort_order
        };
      } else {
        // للأقسام الفرعية - تضمين main_category_id
        submitData = {
          name: formData.name,
          description: formData.description,
          image_url: formData.image_url,
          is_active: formData.is_active,
          sort_order: formData.sort_order,
          main_category_id: formData.main_category_id
        };
      }
      
      console.log('Submit data prepared:', submitData);
      
      if (editingItem) {
        if (formType === 'main') {
          const { error } = await supabase
            .from('main_categories')
            .update(submitData)
            .eq('id', editingItem.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('sub_categories')
            .update(submitData)
            .eq('id', editingItem.id);
          if (error) throw error;
        }
        toast({ title: "تم التحديث بنجاح" });
      } else {
        if (formType === 'main') {
          const { error } = await supabase
            .from('main_categories')
            .insert([submitData]);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('sub_categories')
            .insert([submitData]);
          if (error) throw error;
        }
        toast({ title: "تم الإضافة بنجاح" });
      }
      
      console.log('Operation completed successfully, reloading data...');
      resetForm();
      await loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({ title: "حدث خطأ: " + error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, type: 'main' | 'sub') => {
    try {
      console.log('Deleting item:', id, type);
      
      if (type === 'main') {
        const { error } = await supabase
          .from('main_categories')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sub_categories')
          .delete()
          .eq('id', id);
        if (error) throw error;
      }
      
      console.log('Delete completed successfully, reloading data...');
      toast({ title: "تم الحذف بنجاح" });
      await loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({ title: "حدث خطأ في الحذف: " + error.message, variant: "destructive" });
    }
  };

  const handleEdit = (item: any, type: 'main' | 'sub') => {
    setEditingItem(item);
    setFormType(type);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      image_url: item.image_url || '',
      is_active: item.is_active ?? true,
      sort_order: item.sort_order || 0,
      main_category_id: item.main_category_id || ''
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: '',
      is_active: true,
      sort_order: 0,
      main_category_id: ''
    });
    setEditingItem(null);
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
        <h1 className="text-2xl font-bold text-gray-800">إدارة الأقسام</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadCategories}
          className="mr-auto"
        >
          تحديث البيانات
        </Button>
      </div>

      {!showAddForm ? (
        <div className="space-y-6">
          <div className="flex gap-2">
            <Button onClick={() => { setFormType('main'); setShowAddForm(true); }}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة قسم رئيسي
            </Button>
            <Button onClick={() => { setFormType('sub'); setShowAddForm(true); }}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة قسم فرعي
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>الأقسام الرئيسية ({mainCategories.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {mainCategories.length === 0 ? (
                <p className="text-gray-500 text-center py-4">لا توجد أقسام رئيسية</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الترتيب</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mainCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>{category.is_active ? 'نشط' : 'غير نشط'}</TableCell>
                        <TableCell>{category.sort_order}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(category, 'main')}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(category.id, 'main')}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الأقسام الفرعية ({subCategories.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {subCategories.length === 0 ? (
                <p className="text-gray-500 text-center py-4">لا توجد أقسام فرعية</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>القسم الرئيسي</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.main_categories?.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>{category.is_active ? 'نشط' : 'غير نشط'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(category, 'sub')}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(category.id, 'sub')}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'تعديل' : 'إضافة'} {formType === 'main' ? 'قسم رئيسي' : 'قسم فرعي'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">الاسم</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {formType === 'sub' && (
                <div>
                  <Label htmlFor="main-category">القسم الرئيسي</Label>
                  <select
                    id="main-category"
                    value={formData.main_category_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, main_category_id: e.target.value }))}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">اختر القسم الرئيسي</option>
                    {mainCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <Label htmlFor="image">الصورة</Label>
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

              <div>
                <Label htmlFor="sort-order">ترتيب العرض</Label>
                <Input
                  id="sort-order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="active">الحالة</Label>
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="w-4 h-4 ml-2" />
                  {editingItem ? 'تحديث' : 'إضافة'}
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
