
import { useState, useCallback, memo } from 'react';
import { CategoriesGrid } from '@/components/CategoriesGrid';
import { ProductsGrid } from '@/components/ProductsGrid';
import { OffersCarousel } from '@/components/OffersCarousel';
import { DeliveryNotice } from '@/components/DeliveryNotice';
import { SearchScreen } from '@/components/screens/SearchScreen';
import { RecommendationsPanel } from '@/components/RecommendationsPanel';
import { LoyaltyPanel } from '@/components/LoyaltyPanel';
import { MapPin, Search, Bell, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpecialSection } from '@/components/SpecialSection';

interface HomeScreenProps {
  onAddToCart: (product: any, quantity?: number) => void;
  selectedSubCategory?: string | null;
}

export const HomeScreen = memo(({ onAddToCart, selectedSubCategory }: HomeScreenProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentSubCategory, setCurrentSubCategory] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [subCategoryName, setSubCategoryName] = useState<string>('');
  const [showSearch, setShowSearch] = useState(false);

  const handleCategorySelect = useCallback(async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentSubCategory(null);
    
    // Get category name for display
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from('main_categories')
        .select('name')
        .eq('id', categoryId)
        .single();
      
      if (data) {
        setCategoryName(data.name);
      }
    } catch (error) {
      console.error('Error fetching category name:', error);
    }
  }, []);

  const handleSubCategorySelect = useCallback(async (subCategoryId: string) => {
    setCurrentSubCategory(subCategoryId);
    
    // Get subcategory name for display
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from('sub_categories')
        .select('name')
        .eq('id', subCategoryId)
        .single();
      
      if (data) {
        setSubCategoryName(data.name);
      }
    } catch (error) {
      console.error('Error fetching subcategory name:', error);
    }
  }, []);

  const handleBackToMain = useCallback(() => {
    setSelectedCategory(null);
    setCurrentSubCategory(null);
    setCategoryName('');
    setSubCategoryName('');
  }, []);

  const handleBackToCategory = useCallback(() => {
    setCurrentSubCategory(null);
    setSubCategoryName('');
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

  // Search screen
  if (showSearch) {
    return (
      <SearchScreen 
        onAddToCart={onAddToCart}
        onBack={() => setShowSearch(false)}
      />
    );
  }

  // Main categories screen
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        {/* Header الجديد لـ Elfahd City */}
        <div className="relative elfahd-gradient pb-8 pt-12">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 px-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/80 text-sm arabic-text">التوصيل إلى</p>
                  <p className="text-white font-bold arabic-text">الموقع الحالي</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 w-10 h-10 rounded-xl">
                  <Bell className="w-5 h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowSearch(true)}
                  className="text-white hover:bg-white/20 w-10 h-10 rounded-xl"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-2xl border-4 border-white/30">
                <span className="text-5xl">🏰</span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-3 arabic-text drop-shadow-2xl">
                مرحباً بك في Elfahd City
              </h1>
              <p className="text-white/90 arabic-text text-xl font-medium drop-shadow-lg">
                مدينة الفهد - كل ما تحتاجه في مكان واحد
              </p>
            </div>

            {/* Search Bar المحدث */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border-2 border-white/50">
              <div className="flex items-center space-x-4">
                <Search className="w-6 h-6 text-purple-500" />
                <input
                  type="text"
                  placeholder="ابحث في مدينة الفهد..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 arabic-text text-lg"
                />
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Content */}
        <div className="relative -mt-6 z-10">
          <OffersCarousel />
          <div className="p-4 space-y-6">
            {/* القسم المميز */}
            <SpecialSection />
            <DeliveryNotice />
            <CategoriesGrid 
              onCategorySelect={handleCategorySelect}
              selectedSubCategory={selectedSubCategory}
            />
          </div>
        </div>
      </div>
    );
  }

  // Sub-categories screen
  if (!currentSubCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="relative elfahd-gradient pb-6 pt-12">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 px-4">
            {/* Back Button */}
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={handleBackToMain}
                variant="ghost"
                className="text-white hover:bg-white/20 p-2 rounded-xl"
              >
                <ArrowRight className="w-5 h-5 ml-2" />
                <span className="arabic-text">العودة للرئيسية</span>
              </Button>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2 arabic-text drop-shadow-lg">
                🏰 {categoryName}
              </h1>
              <p className="text-white/90 arabic-text text-lg drop-shadow-md">
                اختر المتجر المفضل لديك في مدينة الفهد
              </p>
            </div>
          </div>
        </div>
        
        <div className="relative -mt-4 z-10 p-4">
          <DeliveryNotice />
          <CategoriesGrid 
            parentCategoryId={selectedCategory}
            onCategorySelect={handleSubCategorySelect}
            showSubCategories={true}
            selectedSubCategory={selectedSubCategory}
          />
        </div>
      </div>
    );
  }

  // Products screen
  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="relative elfahd-gradient pb-6 pt-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 px-4">
          {/* Back Button */}
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={handleBackToCategory}
              variant="ghost"
              className="text-white hover:bg-white/20 p-2 rounded-xl"
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              <span className="arabic-text">العودة للمتاجر</span>
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2 arabic-text drop-shadow-lg">
              🍽️ {subCategoryName}
            </h1>
            <p className="text-white/90 arabic-text text-lg drop-shadow-md">
              اختر منتجاتك المفضلة من مدينة الفهد
            </p>
          </div>
        </div>
      </div>
      
      <div className="relative -mt-4 z-10 p-4">
        <DeliveryNotice />
        <ProductsGrid 
          subCategoryId={currentSubCategory}
          onAddToCart={handleAddToCartWithWarning}
        />
      </div>
    </div>
  );
});

HomeScreen.displayName = 'HomeScreen';
