
import { Badge } from '@/components/ui/badge';

interface CategoryGridHeaderProps {
  showSubCategories: boolean;
  categoriesCount: number;
}

export const CategoryGridHeader = ({ showSubCategories, categoriesCount }: CategoryGridHeaderProps) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 arabic-text mb-1">
            {showSubCategories ? '🏪 المتاجر والمطاعم' : '🍽️ تصفح حسب الفئة'}
          </h2>
          <p className="text-gray-600 text-sm arabic-text">
            {showSubCategories ? 'اختر المتجر المفضل لديك' : 'اختر الفئة التي تريد التسوق منها'}
          </p>
        </div>
        
        <Badge variant="secondary" className="arabic-text text-sm px-3 py-1 bg-orange-100 text-orange-700 border border-orange-200">
          {categoriesCount} {showSubCategories ? 'متجر' : 'فئة'}
        </Badge>
      </div>
    </div>
  );
};
