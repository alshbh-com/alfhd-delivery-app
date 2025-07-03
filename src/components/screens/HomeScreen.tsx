
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        {/* Header المحدث */}
        <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 pb-8 pt-12">
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
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-2xl">
                <span className="text-4xl">🛍️</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3 arabic-text drop-shadow-lg">
                أهلاً بك في طلبيات
              </h1>
              <p className="text-white/90 arabic-text text-lg font-medium drop-shadow-md">
                اختر القسم المناسب وابدأ التسوق الآن
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/50">
              <div className="flex items-center space-x-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن المطاعم والمتاجر..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 arabic-text"
                />
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Content */}
        <div className="relative -mt-4 z-10">
          <OffersCarousel />
          <div className="p-4">
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 pb-6 pt-12">
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
                🏪 {categoryName}
              </h1>
              <p className="text-white/90 arabic-text text-lg drop-shadow-md">
                اختر المتجر المفضل لديك
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 pb-6 pt-12">
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
              اختر منتجاتك المفضلة
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
