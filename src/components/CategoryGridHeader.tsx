
import { Badge } from '@/components/ui/badge';
import { Sparkles, Store } from 'lucide-react';

interface CategoryGridHeaderProps {
  showSubCategories: boolean;
  categoriesCount: number;
}

export const CategoryGridHeader = ({ showSubCategories, categoriesCount }: CategoryGridHeaderProps) => {
  return (
    <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-orange-100 overflow-hidden mb-6">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-200/30 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl">
            {showSubCategories ? (
              <Store className="w-8 h-8 text-white" />
            ) : (
              <Sparkles className="w-8 h-8 text-white" />
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 arabic-text mb-1 flex items-center">
              {showSubCategories ? '🏪 المتاجر والمطاعم' : '🎯 تصفح حسب الفئة'}
            </h2>
            <p className="text-gray-600 arabic-text text-base leading-relaxed">
              {showSubCategories ? 'اختر المتجر المفضل لديك واستمتع بالتسوق' : 'اكتشف أفضل الفئات المتاحة لديك'}
            </p>
          </div>
        </div>
        
        <Badge className="arabic-text text-lg px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg font-bold">
          {categoriesCount} {showSubCategories ? 'متجر' : 'فئة'}
        </Badge>
      </div>
    </div>
  );
};
