
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { OffersCarousel } from '../OffersCarousel';
import { CategoriesGrid } from '../CategoriesGrid';
import { ProductsGrid } from '../ProductsGrid';
import { DeveloperContact } from '../DeveloperContact';

interface HomeScreenProps {
  onAddToCart: (product: any, quantity: number) => void;
}

export const HomeScreen = ({ onAddToCart }: HomeScreenProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(null);
  };

  const handleSubCategorySelect = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);
  };

  const handleBackToCategories = () => {
    if (selectedSubCategory) {
      setSelectedSubCategory(null);
    } else {
      setSelectedCategory(null);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-green-600 mb-2">متجر الفهد</h1>
        <p className="text-gray-600">متجرك المفضل للتوصيل السريع</p>
      </div>

      {/* Navigation */}
      {(selectedCategory || selectedSubCategory) && (
        <button
          onClick={handleBackToCategories}
          className="mb-4 flex items-center text-green-600 hover:text-green-700"
        >
          ← رجوع
        </button>
      )}

      {/* Content */}
      {!selectedCategory ? (
        <>
          <OffersCarousel />
          <CategoriesGrid onCategorySelect={handleCategorySelect} />
          <DeveloperContact />
        </>
      ) : !selectedSubCategory ? (
        <CategoriesGrid 
          parentCategoryId={selectedCategory}
          onCategorySelect={handleSubCategorySelect}
          showSubCategories={true}
        />
      ) : (
        <ProductsGrid 
          subCategoryId={selectedSubCategory}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
};
