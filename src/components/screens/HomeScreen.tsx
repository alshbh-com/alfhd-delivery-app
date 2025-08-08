
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Header بتصميم تطبيق الطعام الحديث */}
        <div className="relative app-gradient pb-8 pt-6 px-4">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            {/* Top Status Bar */}
            <div className="flex items-center justify-between mb-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-xs arabic-text">التوصيل لـ</p>
                  <p className="text-white font-semibold arabic-text text-sm">المنزل</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20 w-9 h-9 rounded-full"
                  >
                    <Bell className="w-4 h-4" />
                  </Button>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowSearch(true)}
                  className="text-white hover:bg-white/20 w-9 h-9 rounded-full"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Hero Section */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 rounded-2xl mb-4 backdrop-blur-sm border border-white/30">
                <span className="text-3xl">🛒</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 arabic-text">
                مرحباً بك في الفهد
              </h1>
              <p className="text-white/90 arabic-text text-sm">
                اطلب ما تشاء من متاجرك المفضلة
              </p>
            </div>

            {/* Modern Search Bar */}
            <div 
              className="bg-white rounded-2xl p-4 shadow-lg mb-4 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setShowSearch(true)}
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500 arabic-text flex-1 text-right">ابحث عن منتج، متجر أو صنف...</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">⚡</div>
                <span className="text-white text-xs arabic-text">توصيل سريع</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">🎯</div>
                <span className="text-white text-xs arabic-text">عروض خاصة</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">⭐</div>
                <span className="text-white text-xs arabic-text">الأكثر طلباً</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">🏪</div>
                <span className="text-white text-xs arabic-text">متاجر قريبة</span>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Content */}
        <div className="relative -mt-6 z-10">
          <OffersCarousel onAddToCart={handleAddToCartWithToast} />
          <div className="p-4 space-y-6">
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
