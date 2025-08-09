
import { useState, useCallback, memo } from 'react';
import { CategoriesGrid } from '@/components/CategoriesGrid';
import { ProductsGrid } from '@/components/ProductsGrid';
import { OffersCarousel } from '@/components/OffersCarousel';

import { SearchScreen } from '@/components/screens/SearchScreen';
import { RecommendationsPanel } from '@/components/RecommendationsPanel';
import { LoyaltyPanel } from '@/components/LoyaltyPanel';
import { MapPin, Search, Bell, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpecialSection } from '@/components/SpecialSection';

interface HomeScreenProps {
  onAddToCart: (product: any, quantity?: number) => void;
  selectedSubCategory?: string | null;
  cart?: any[];
}

export const HomeScreen = memo(({ onAddToCart, selectedSubCategory, cart = [] }: HomeScreenProps) => {
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

  // ... keep existing code
  
  const handleAddToCartWithToast = useCallback((product: any, quantity: number = 1) => {
    handleAddToCartWithWarning(product, quantity);
    
    // إضافة إشعار بنجاح الإضافة
    import('@/hooks/use-toast').then(({ toast }) => {
      if (product.is_offer) {
        toast({
          title: "تم إضافة العرض للسلة!",
          description: `${product.name} - سيتم تحديد السعر في المحادثة`
        });
      } else if (product.is_special) {
        toast({
          title: "تم إضافة طلبك المميز للسلة!",
          description: "يمكنك الآن إتمام الطلب من السلة"
        });
      } else {
        toast({
          title: "تم إضافة المنتج للسلة!",
          description: `${product.name} - ${product.price} جنيه`
        });
      }
    });
  }, [handleAddToCartWithWarning]);

  // Main categories screen
  if (!selectedCategory) {
    return (
      <div className="min-h-screen">
        {/* Hero Section with Side Layout */}
        <div className="relative min-h-screen flex">
          {/* Left Side - Content */}
          <div className="flex-1 p-8 pt-4">
            {/* Welcome Section */}
            <div className="mb-12">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl"
                     style={{
                       background: 'linear-gradient(135deg, hsl(24, 95%, 60%) 0%, hsl(28, 85%, 65%) 100%)',
                     }}>
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <div>
                  <h1 className="text-4xl font-black text-gray-800 mb-2 arabic-text">
                    أهلاً وسهلاً
                  </h1>
                  <p className="text-gray-600 arabic-text text-lg">
                    اكتشف عالماً من الخيارات المميزة
                  </p>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
                     style={{
                       background: 'linear-gradient(135deg, #ffffff 0%, #fef7f0 100%)',
                       border: '2px solid rgba(251, 146, 60, 0.1)'
                     }}
                     onClick={() => setShowSearch(true)}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                         style={{
                           background: 'linear-gradient(135deg, hsl(24, 95%, 60%) 0%, hsl(28, 85%, 65%) 100%)',
                         }}>
                      <Search className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 arabic-text">البحث السريع</h3>
                      <p className="text-gray-500 text-sm arabic-text">ابحث عن أي شيء تريده</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
                     style={{
                       background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                       border: '2px solid rgba(59, 130, 246, 0.1)'
                     }}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">🎁</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 arabic-text">العروض المميزة</h3>
                      <p className="text-gray-500 text-sm arabic-text">اكتشف أفضل العروض</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
                     style={{
                       background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
                       border: '2px solid rgba(34, 197, 94, 0.1)'
                     }}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 arabic-text">توصيل سريع</h3>
                      <p className="text-gray-500 text-sm arabic-text">خلال 30 دقيقة</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories Section */}
            <div>
              <h2 className="text-2xl font-black text-gray-800 mb-6 arabic-text">تصفح الأقسام</h2>
              <CategoriesGrid 
                onCategorySelect={handleCategorySelect}
                selectedSubCategory={selectedSubCategory}
              />
            </div>
          </div>

          {/* Right Side - Floating Offers */}
          <div className="hidden lg:block w-80 p-6">
            <div className="sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-4 arabic-text">العروض الحصرية</h3>
              <OffersCarousel onAddToCart={handleAddToCartWithToast} />
            </div>
          </div>
        </div>

        {/* Mobile Offers Section */}
        <div className="lg:hidden px-8 pb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 arabic-text">العروض الحصرية</h3>
          <OffersCarousel onAddToCart={handleAddToCartWithToast} />
        </div>
      </div>
    );
  }

  // Sub-categories screen
  if (!currentSubCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
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
                📱 {categoryName}
              </h1>
              <p className="text-white/90 arabic-text text-lg drop-shadow-md">
                اختر المتجرك المفضل في تطبيق الفهد
              </p>
            </div>
          </div>
        </div>
        
        <div className="relative -mt-4 z-10 p-4 space-y-6">
          {/* القسم المميز */}
          <SpecialSection onAddToCart={handleAddToCartWithToast} />
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
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
              اختر منتجاتك المفضلة من تطبيق الفهد
            </p>
          </div>
        </div>
      </div>
      
      <div className="relative -mt-4 z-10 p-4">
        <ProductsGrid 
          subCategoryId={currentSubCategory}
          onAddToCart={handleAddToCartWithToast}
          cart={cart}
        />
      </div>
    </div>
  );
});

HomeScreen.displayName = 'HomeScreen';
