
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

interface ProductManagementProps {
  onBack: () => void;
}

export const ProductManagement = ({ onBack }: ProductManagementProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    is_active: true,
    sort_order: 0,
    sub_category_id: '',
    sizes: [] as Array<{size: string, price: number}>
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: productsData } = await supabase
        .from('products')
        .select('*, sub_categories(name)')
        .order('sort_order');
      
      const { data: subCategoriesData } = await supabase
        .from('sub_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (productsData) setProducts(productsData);
      if (subCategoriesData) setSubCategories(subCategoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({ title: "خطأ في تحميل البيانات", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await supabase
          .from('products')
          .update(formData)
          .eq('id', editingProduct.id);
        toast({ title: "تم التحديث بنجاح" });
      } else {
        await supabase
          .from('products')
          .insert([formData]);
        toast({ title: "تم الإضافة بنجاح" });
      }
      
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      toast({ title: "تم الحذف بنجاح" });
      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({ title: "حدث خطأ في الحذف", variant: "destructive" });
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      image_url: product.image_url || '',
      is_active: product.is_active ?? true,
      sort_order: product.sort_order || 0,
      sub_category_id: product.sub_category_id || '',
      sizes: product.sizes || []
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      image_url: '',
      is_active: true,
      sort_order: 0,
      sub_category_id: '',
      sizes: []
    });
    setEditingProduct(null);
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
        <h1 className="text-2xl font-bold text-gray-800">إدارة المنتجات</h1>
      </div>

      {!showAddForm ? (
        <div className="space-y-6">
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة منتج جديد
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>قائمة المنتجات</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>القسم</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.sub_categories?.name}</TableCell>
                      <TableCell>{product.price} جنيه</TableCell>
                      <TableCell>{product.is_active ? 'نشط' : 'غير نشط'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
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
              {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">اسم المنتج</Label>
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

              <div>
                <Label htmlFor="sub-category">القسم</Label>
                <select
                  id="sub-category"
                  value={formData.sub_category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, sub_category_id: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">اختر القسم</option>
                  {subCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="price">السعر</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">صورة المنتج</Label>
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

              <div>
                <Label>الأحجام والأسعار</Label>
                <div className="space-y-3 border rounded-lg p-4">
                  {formData.sizes.map((size, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Input
                        placeholder="الحجم (مثل: صغير)"
                        value={size.size}
                        onChange={(e) => {
                          const newSizes = [...formData.sizes];
                          newSizes[index] = { ...size, size: e.target.value };
                          setFormData(prev => ({ ...prev, sizes: newSizes }));
                        }}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="السعر"
                        value={size.price}
                        onChange={(e) => {
                          const newSizes = [...formData.sizes];
                          newSizes[index] = { ...size, price: parseFloat(e.target.value) || 0 };
                          setFormData(prev => ({ ...prev, sizes: newSizes }));
                        }}
                        className="w-24"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newSizes = formData.sizes.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, sizes: newSizes }));
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        sizes: [...prev.sizes, { size: '', price: 0 }]
                      }));
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة حجم
                  </Button>
                </div>
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
                  {editingProduct ? 'تحديث' : 'إضافة'}
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
