
import { Card, CardContent } from '@/components/ui/card';
import { Store, Utensils, Clock, ArrowLeft, Star, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CategoryCardProps {
  category: any;
  index: number;
  showSubCategories: boolean;
  onCategorySelect: (categoryId: string) => void;
}

const gradients = [
  'from-blue-500 via-teal-500 to-cyan-500',
  'from-orange-500 via-red-500 to-pink-500', 
  'from-emerald-500 via-green-500 to-teal-500',
  'from-amber-500 via-yellow-500 to-orange-500',
  'from-violet-500 via-purple-500 to-indigo-500',
  'from-sky-500 via-blue-500 to-cyan-500',
  'from-lime-500 via-green-500 to-emerald-500',
  'from-rose-500 via-pink-500 to-red-500',
];

const shadowColors = [
  'shadow-blue-500/25',
  'shadow-orange-500/25',
  'shadow-emerald-500/25',
  'shadow-amber-500/25',
  'shadow-violet-500/25',
  'shadow-sky-500/25',
  'shadow-lime-500/25',
  'shadow-rose-500/25',
];

export const CategoryCard = ({ category, index, showSubCategories, onCategorySelect }: CategoryCardProps) => {
  const isMainCategory = !showSubCategories;
  
  if (isMainCategory) {
    return (
      <Card
        className={`modern-card cursor-pointer hover:scale-[1.02] p-0 overflow-hidden ${
          !category.is_open ? 'opacity-75' : ''
        }`}
        onClick={() => {
          if (category.is_open !== false) {
            onCategorySelect(category.id);
          }
        }}
      >
        <CardContent className="p-0">
          <div className="relative h-28 bg-gradient-to-br from-slate-100 to-slate-200">
            {category.image_url ? (
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                <Utensils className="w-12 h-12 text-primary" />
              </div>
            )}
            
            {/* Closed Overlay */}
            {category.is_open === false && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-white text-center">
                  <Clock className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-sm font-semibold arabic-text">مغلق</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-3">
            <h3 className="font-bold text-sm arabic-text text-gray-800 mb-1">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-xs text-gray-600 arabic-text line-clamp-2">
                {category.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Store Card Design for Sub Categories
  return (
    <Card
      className={`modern-card cursor-pointer hover:scale-[1.02] p-0 overflow-hidden ${
        !category.is_open ? 'opacity-75' : ''
      }`}
      onClick={() => {
        if (category.is_open !== false) {
          onCategorySelect(category.id);
        }
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {category.image_url ? (
              <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md">
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-primary" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-base arabic-text text-gray-800 mb-1">
                  {category.name}
                </h3>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">4.5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600 arabic-text">20-30 دقيقة</span>
                  </div>
                </div>
                {category.description && (
                  <p className="text-xs text-gray-500 arabic-text line-clamp-1">
                    {category.description}
                  </p>
                )}
              </div>
              
              {category.is_open === false && (
                <Badge variant="secondary" className="text-xs arabic-text">
                  مغلق
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
