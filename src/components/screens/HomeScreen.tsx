
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
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white py-6 shadow-sm border-b">
          <div className="text-center mb-4 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 arabic-text">
              🛍️ طلبيات
            </h1>
            <p className="text-gray-600 arabic-text text-lg">
              اختر القسم المناسب وابدأ التسوق الآن
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
      <div className="min-h-screen bg-gray-50 p-4">
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
    <div className="min-h-screen bg-gray-50 p-4">
      <ProductsGrid 
        subCategoryId={currentSubCategory}
        onAddToCart={handleAddToCartWithWarning}
      />
    </div>
  );
});

HomeScreen.displayName = 'HomeScreen';
