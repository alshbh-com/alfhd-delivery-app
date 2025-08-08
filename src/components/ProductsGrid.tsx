
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Plus, Minus, ShoppingCart, Star, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductsGridProps {
  subCategoryId: string;
  onAddToCart: (product: any, quantity: number) => void;
  cart?: any[];
}

export const ProductsGrid = ({ subCategoryId, onAddToCart, cart = [] }: ProductsGridProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const [selectedSizes, setSelectedSizes] = useState<{[key: string]: string}>({});
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
    const selectedSize = selectedSizes[product.id];
    
    // إذا كان المنتج له أحجام ولم يتم اختيار حجم
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "⚠️ يرجى اختيار الحجم",
        description: "يجب اختيار حجم المنتج قبل الإضافة للسلة",
        variant: "destructive"
      });
      return;
    }
    
    // إنشاء كائن المنتج مع الحجم المختار
    const productWithSize = {
      ...product,
      selectedSize,
      displayPrice: selectedSize ? 
        product.sizes.find((s: any) => s.size === selectedSize)?.price || product.price 
        : product.price
    };
    
    onAddToCart(productWithSize, quantity);
    setQuantities(prev => ({ ...prev, [product.id]: 0 }));
    setSelectedSizes(prev => ({ ...prev, [product.id]: '' }));
    
    toast({
      title: "✅ تم إضافة المنتج",
      description: `تم إضافة ${product.name}${selectedSize ? ` (${selectedSize})` : ''} إلى السلة بنجاح`,
    });
  };

  // دالة للحصول على كمية المنتج في السلة
  const getCartQuantity = (productId: string) => {
    return cart.reduce((total, item) => {
      return item.id === productId ? total + item.quantity : total;
    }, 0);
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
    <div className="space-y-4">
      {/* Products List */}
      <div className="space-y-3">
        {products.map((product) => (
          <Card key={product.id} className="modern-card hover:scale-[1.01] transition-all duration-200">
            <CardContent className="p-3">
              <div className="flex gap-3">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm text-gray-800 arabic-text">
                          {product.name}
                        </h3>
                        {getCartQuantity(product.id) > 0 && (
                          <div className="bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {getCartQuantity(product.id)}
                          </div>
                        )}
                      </div>
                      {product.description && (
                        <p className="text-gray-500 text-xs arabic-text line-clamp-2 mb-2">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                   
                  {/* Size Selection */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-2">
                      <Label className="text-xs font-medium text-gray-600 arabic-text mb-1 block">
                        اختر الحجم:
                      </Label>
                      <RadioGroup
                        value={selectedSizes[product.id] || ''}
                        onValueChange={(value) => setSelectedSizes(prev => ({ ...prev, [product.id]: value }))}
                        className="flex flex-wrap gap-1"
                      >
                        {product.sizes.map((size: any, index: number) => (
                          <div key={index} className="flex items-center">
                            <RadioGroupItem 
                              value={size.size} 
                              id={`${product.id}-${size.size}`}
                              className="text-primary w-3 h-3"
                            />
                            <Label 
                              htmlFor={`${product.id}-${size.size}`}
                              className="text-xs arabic-text cursor-pointer mr-1"
                            >
                              {size.size} ({size.price}ج)
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                  
                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-primary arabic-text">
                        {selectedSizes[product.id] ? 
                          `${product.sizes.find((s: any) => s.size === selectedSizes[product.id])?.price || product.price} جنيه`
                          : `${product.price} جنيه`
                        }
                      </span>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs arabic-text">25 دقيقة</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {quantities[product.id] > 0 ? (
                        <div className="flex items-center bg-gray-50 rounded-full">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-7 h-7 p-0 rounded-full hover:bg-gray-200"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="font-semibold text-sm min-w-[20px] text-center px-2">
                            {quantities[product.id]}
                          </span>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-7 h-7 p-0 rounded-full hover:bg-gray-200"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => updateQuantity(product.id, 1)}
                          size="sm"
                          className="delivery-button h-8 px-3 text-xs arabic-text"
                        >
                          <Plus className="w-3 h-3 ml-1" />
                          أضف
                        </Button>
                      )}
                      
                      {quantities[product.id] > 0 && (
                        <Button
                          onClick={() => handleAddToCart(product)}
                          size="sm"
                          className="success-button h-8 px-4 text-xs arabic-text"
                        >
                          للسلة
                        </Button>
                      )}
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
