
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { OffersCarousel } from '../OffersCarousel';
import { CategoriesGrid } from '../CategoriesGrid';
import { ProductsGrid } from '../ProductsGrid';
import { DeveloperContact } from '../DeveloperContact';
import { Search, MapPin, Bell, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HomeScreenProps {
  onAddToCart: (product: any, quantity: number) => void;
  selectedCity?: string;
}

export const HomeScreen = ({ onAddToCart, selectedCity = "المدينة" }: HomeScreenProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="talabat-gradient text-white">
        <div className="p-6 pb-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="arabic-text">
                <p className="text-sm opacity-90">التوصيل إلى</p>
                <p className="font-semibold">{selectedCity}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Brand */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2 arabic-text">متجر الفهد</h1>
            <p className="text-white/90 arabic-text">أسرع خدمة توصيل في منطقتك</p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="ابحث عن المنتجات والمحلات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="talabat-input pr-12 text-right arabic-text bg-white/90 backdrop-blur-sm border-0"
            />
          </div>
        </div>

        {/* Wave Effect */}
        <div className="relative">
          <svg
            className="absolute bottom-0 left-0 w-full h-4 text-gray-50"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              fill="currentColor"
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              fill="currentColor"
            />
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-2 relative z-10">
        {/* Navigation */}
        {(selectedCategory || selectedSubCategory) && (
          <div className="floating-card p-4 mb-4">
            <button
              onClick={handleBackToCategories}
              className="flex items-center text-orange-600 hover:text-orange-700 font-medium arabic-text"
            >
              <ChevronRight className="ml-2 h-5 w-5" />
              رجوع
            </button>
          </div>
        )}

        {/* Main Content */}
        {!selectedCategory ? (
          <div className="space-y-6">
            <OffersCarousel />
            <CategoriesGrid onCategorySelect={handleCategorySelect} />
            <DeveloperContact />
          </div>
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
    </div>
  );
};
