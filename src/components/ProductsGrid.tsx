
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, ShoppingCart, Star, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductsGridProps {
  subCategoryId: string;
  onAddToCart: (product: any, quantity: number) => void;
}

export const ProductsGrid = ({ subCategoryId, onAddToCart }: ProductsGridProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, [subCategoryId]);

  const loadProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('sub_category_id', subCategoryId)
        .eq('is_active', true)
        .order('sort_order');
      
      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change)
    }));
  };

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id] || 1;
    onAddToCart(product, quantity);
    setQuantities(prev => ({ ...prev, [product.id]: 0 }));
    
    toast({
      title: "✅ تم إضافة المنتج",
      description: `تم إضافة ${product.name} إلى السلة بنجاح`,
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-32" />
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-12 h-12 text-gray-400" />
        </div>
        <p className="text-gray-600 arabic-text text-lg">لا توجد منتجات متاحة</p>
        <p className="text-gray-400 arabic-text text-sm mt-2">سيتم إضافة منتجات جديدة قريباً</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 arabic-text">المنتجات</h2>
          <p className="text-gray-600 mt-1 arabic-text">اختر منتجاتك المفضلة</p>
        </div>
        <Badge variant="secondary" className="arabic-text">
          {products.length} منتج
        </Badge>
      </div>
      
      {/* Products List */}
      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id} className="product-card">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-xl shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-md">
                      <ShoppingCart className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 arabic-text">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-gray-600 text-sm mt-1 arabic-text leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.5</span>
                    </div>
                  </div>
                  
                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-orange-600">
                        {product.price} جنيه
                      </span>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs arabic-text">20-30 دقيقة</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {quantities[product.id] > 0 && (
                        <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-3 py-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-8 h-8 p-0 rounded-full hover:bg-gray-200"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          
                          <span className="font-bold text-lg min-w-[20px] text-center">
                            {quantities[product.id]}
                          </span>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-8 h-8 p-0 rounded-full hover:bg-gray-200"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      
                      <Button
                        onClick={() => {
                          if (quantities[product.id] === 0) {
                            updateQuantity(product.id, 1);
                          }
                          handleAddToCart(product);
                        }}
                        className="talabat-button px-6 arabic-text"
                      >
                        {quantities[product.id] > 0 ? 'إضافة للسلة' : 'اطلب الآن'}
                        <Plus className="mr-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
