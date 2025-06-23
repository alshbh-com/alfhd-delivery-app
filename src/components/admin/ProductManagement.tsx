
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
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
    price: '',
    image_url: '',
    sub_category_id: '',
    sort_order: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
    loadSubCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*, sub_categories(name, main_categories(name))')
        .order('sort_order');
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadSubCategories = async () => {
    try {
      const { data } = await supabase
        .from('sub_categories')
        .select('*, main_categories(name)')
        .eq('is_active', true)
        .order('name');
      setSubCategories(data || []);
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: formData.image_url,
        sub_category_id: formData.sub_category_id,
        sort_order: formData.sort_order
      };

      if (editingProduct) {
        await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        toast({ title: "تم تحديث المنتج بنجاح" });
      } else {
        await supabase
          .from('products')
          .insert([productData]);
        toast({ title: "تم إضافة المنتج بنجاح" });
      }

      setFormData({ name: '', description: '', price: '', image_url: '', sub_category_id: '', sort_order: 0 });
      setShowAddForm(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image_url: product.image_url || '',
      sub_category_id: product.sub_category_id,
      sort_order: product.sort_order || 0
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    try {
      await supabase.from('products').delete().eq('id', id);
      toast({ title: "تم حذف المنتج بنجاح" });
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
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
        <h1 className="text-2xl font-bold text-gray-800">إدارة المنتجات</h1>
      </div>

      <Button onClick={() => { setShowAddForm(true); setEditingProduct(null); }}>
        <Plus className="w-4 h-4 ml-2" />
        إضافة منتج جديد
      </Button>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">اسم المنتج</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسم المنتج"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">وصف المنتج</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="أدخل وصف المنتج"
                />
              </div>

              <div>
                <Label htmlFor="price">السعر (جنيه)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="sub_category">القسم</Label>
                <select
                  id="sub_category"
                  value={formData.sub_category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, sub_category_id: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">اختر القسم</option>
                  {subCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.main_categories?.name} - {cat.name}
                    </option>
                  ))}
                </select>
              </div>

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

              <div className="flex gap-2">
                <Button type="submit">
                  {editingProduct ? 'تحديث' : 'إضافة'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); setEditingProduct(null); }}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>قائمة المنتجات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center gap-4">
                  {product.image_url && (
                    <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded" />
                  )}
                  <div>
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <p className="text-lg font-bold text-green-600">{product.price} جنيه</p>
                    <p className="text-xs text-blue-600">
                      {product.sub_categories?.main_categories?.name} - {product.sub_categories?.name}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)}>
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
