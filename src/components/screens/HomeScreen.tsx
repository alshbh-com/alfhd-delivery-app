
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
        {/* Header مصغر وأنيق */}
        <div className="relative pb-4 pt-8 overflow-hidden"
             style={{
               background: 'linear-gradient(135deg, hsl(24, 95%, 60%) 0%, hsl(28, 85%, 65%) 50%, hsl(200, 85%, 55%) 100%)',
             }}>          
          <div className="relative z-10 px-4">
            {/* Top Bar مصغر */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3 text-white">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white/80 text-xs arabic-text">التوصيل إلى</p>
                  <p className="text-white font-bold arabic-text text-sm">الموقع الحالي</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="floating" size="icon" className="text-white bg-white/20 hover:bg-white/30 border-white/30 w-8 h-8 rounded-xl">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button 
                  variant="floating" 
                  size="icon" 
                  onClick={() => setShowSearch(true)}
                  className="text-white bg-white/20 hover:bg-white/30 border-white/30 w-8 h-8 rounded-xl"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Welcome Message مصغر */}
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-white mb-2 arabic-text">
                مرحباً بك في Elfahd App
              </h1>
            </div>

            {/* Search Bar مصغر */}
            <div className="bg-white/98 backdrop-blur-2xl rounded-2xl p-3 shadow-lg border border-white/30">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Search className="w-4 h-4 text-primary" />
                </div>
                <input
                  type="text"
                  placeholder="ابحث في تطبيق الفهد..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 arabic-text text-sm"
                />
                <Button variant="gradient" size="sm" className="rounded-xl text-xs px-3 py-1">
                  بحث
                </Button>
              </div>
            </div>
          </div>
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
