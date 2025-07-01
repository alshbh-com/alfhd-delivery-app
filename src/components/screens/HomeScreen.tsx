
import { useState, useCallback, memo } from 'react';
import { CategoriesGrid } from '@/components/CategoriesGrid';
import { ProductsGrid } from '@/components/ProductsGrid';
import { OffersCarousel } from '@/components/OffersCarousel';

interface HomeScreenProps {
  onAddToCart: (product: any, quantity?: number) => void;
  selectedSubCategory?: string | null;
}

export const HomeScreen = memo(({ onAddToCart, selectedSubCategory }: HomeScreenProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentSubCategory, setCurrentSubCategory] = useState<string | null>(null);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentSubCategory(null);
  }, []);

  const handleSubCategorySelect = useCallback((subCategoryId: string) => {
    setCurrentSubCategory(subCategoryId);
  }, []);

  const handleAddToCartWithWarning = useCallback((product: any, quantity: number = 1) => {
    if (selectedSubCategory && selectedSubCategory !== product.sub_category_id) {
      const confirmSwitch = confirm('لديك منتجات من قسم آخر في السلة. هل تريد إفراغ السلة والبدء من جديد؟');
      if (!confirmSwitch) {
        return;
      }
    }
    onAddToCart(product, quantity);
  }, [selectedSubCategory, onAddToCart]);

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="bg-gradient-to-br from-orange-200 via-white to-red-200 py-8 shadow-lg">
          <div className="text-center mb-6 px-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 arabic-text drop-shadow-lg">
              🛍️ مرحباً بك في متجرنا
            </h1>
            <p className="text-gray-700 arabic-text text-xl font-medium">
              اختر القسم المناسب وابدأ التسوق الآن
            </p>
          </div>
        </div>
        <OffersCarousel />
        <div className="p-6">
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-6">
      <ProductsGrid 
        subCategoryId={currentSubCategory}
        onAddToCart={handleAddToCartWithWarning}
      />
    </div>
  );
});

HomeScreen.displayName = 'HomeScreen';
