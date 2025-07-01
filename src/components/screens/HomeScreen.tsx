
import { useState, useEffect } from 'react';
import { CategoriesGrid } from '@/components/CategoriesGrid';
import { ProductsGrid } from '@/components/ProductsGrid';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { OffersCarousel } from '@/components/OffersCarousel';
import { supabase } from "@/integrations/supabase/client";

interface HomeScreenProps {
  onAddToCart: (product: any, quantity?: number) => void;
  selectedSubCategory?: string;
}

export const HomeScreen = ({ onAddToCart, selectedSubCategory }: HomeScreenProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentSubCategory, setCurrentSubCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadSubCategories(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (currentSubCategory) {
      loadProducts(currentSubCategory);
    }
  }, [currentSubCategory]);

  const loadCategories = async () => {
    try {
      const { data } = await supabase
        .from('main_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (data) setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadSubCategories = async (categoryId: string) => {
    try {
      const { data } = await supabase
        .from('sub_categories')
        .select('*')
        .eq('main_category_id', categoryId)
        .eq('is_active', true)
        .order('sort_order');
      
      if (data) setSubCategories(data);
    } catch (error) {
      console.error('Error loading sub categories:', error);
    }
  };

  const loadProducts = async (subCategoryId: string) => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('sub_category_id', subCategoryId)
        .eq('is_active', true)
        .order('sort_order');
      
      if (data) setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentSubCategory(null);
    setProducts([]);
  };

  const handleSubCategorySelect = (subCategoryId: string) => {
    setCurrentSubCategory(subCategoryId);
  };

  const handleBack = () => {
    if (currentSubCategory) {
      setCurrentSubCategory(null);
      setProducts([]);
    } else if (selectedCategory) {
      setSelectedCategory(null);
      setSubCategories([]);
    }
  };

  // إذا كان المستخدم يتسوق من قسم معين، أظهر تحذير عند محاولة تغيير القسم
  const handleAddToCartWithWarning = (product: any, quantity: number = 1) => {
    if (selectedSubCategory && selectedSubCategory !== product.sub_category_id) {
      const confirmSwitch = confirm('لديك منتجات من قسم آخر في السلة. هل تريد إفراغ السلة والبدء من جديد؟');
      if (!confirmSwitch) {
        return;
      }
    }
    onAddToCart(product, quantity);
  };

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WelcomeScreen />
        <OffersCarousel />
        <CategoriesGrid 
          categories={categories} 
          onCategorySelect={handleCategorySelect}
        />
      </div>
    );
  }

  if (!currentSubCategory) {
    return (
      <CategoriesGrid 
        categories={subCategories} 
        onCategorySelect={handleSubCategorySelect}
        onBack={handleBack}
        title="اختر القسم الفرعي"
      />
    );
  }

  return (
    <ProductsGrid 
      products={products}
      onAddToCart={handleAddToCartWithWarning}
      onBack={handleBack}
      selectedSubCategory={selectedSubCategory}
    />
  );
};
