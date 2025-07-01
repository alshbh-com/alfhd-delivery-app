
import { useState, useEffect } from 'react';
import { CategoriesGrid } from '@/components/CategoriesGrid';
import { ProductsGrid } from '@/components/ProductsGrid';
import { OffersCarousel } from '@/components/OffersCarousel';
import { supabase } from "@/integrations/supabase/client";

interface HomeScreenProps {
  onAddToCart: (product: any, quantity?: number) => void;
  selectedSubCategory?: string | null;
}

export const HomeScreen = ({ onAddToCart, selectedSubCategory }: HomeScreenProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentSubCategory, setCurrentSubCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentSubCategory(null);
  };

  const handleSubCategorySelect = (subCategoryId: string) => {
    setCurrentSubCategory(subCategoryId);
  };

  const handleBack = () => {
    if (currentSubCategory) {
      setCurrentSubCategory(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

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
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-orange-100 to-red-100 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 arabic-text">
              مرحباً بك في متجرنا
            </h1>
            <p className="text-gray-600 arabic-text">
              اختر القسم المناسب وابدأ التسوق
            </p>
          </div>
        </div>
        <OffersCarousel />
        <div className="p-4">
          <CategoriesGrid 
            onCategorySelect={handleCategorySelect}
            selectedSubCategory={selectedSubCategory}
          />
        </div>
      </div>
    );
  }

  if (!currentSubCategory) {
    return (
      <div className="min-h-screen bg-white p-4">
        <CategoriesGrid 
          parentCategoryId={selectedCategory}
          onCategorySelect={handleSubCategorySelect}
          showSubCategories={true}
          selectedSubCategory={selectedSubCategory}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <ProductsGrid 
        subCategoryId={currentSubCategory}
        onAddToCart={handleAddToCartWithWarning}
      />
    </div>
  );
};
