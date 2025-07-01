
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
  'from-orange-500 via-red-500 to-pink-500',
  'from-blue-500 via-purple-500 to-indigo-500', 
  'from-green-500 via-emerald-500 to-teal-500',
  'from-yellow-500 via-orange-500 to-red-500',
  'from-purple-500 via-pink-500 to-rose-500',
  'from-indigo-500 via-blue-500 to-cyan-500',
  'from-teal-500 via-green-500 to-emerald-500',
  'from-pink-500 via-red-500 to-orange-500',
];

const shadowColors = [
  'shadow-orange-500/25',
  'shadow-blue-500/25',
  'shadow-green-500/25',
  'shadow-yellow-500/25',
  'shadow-purple-500/25',
  'shadow-indigo-500/25',
  'shadow-teal-500/25',
  'shadow-pink-500/25',
];

export const CategoryCard = ({ category, index, showSubCategories, onCategorySelect }: CategoryCardProps) => {
  return (
    <Card
      className={`relative cursor-pointer group transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 shadow-2xl border-0 overflow-hidden ${shadowColors[index % shadowColors.length]} ${
        !category.is_open ? 'opacity-75' : ''
      }`}
      onClick={() => {
        if (category.is_open !== false) {
          onCategorySelect(category.id);
        }
      }}
    >
      <CardContent className="p-0 relative overflow-hidden h-32">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]}`} />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 right-2 w-8 h-8 bg-white/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 bg-white/20 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        </div>
        
        {/* Closed Overlay */}
        {category.is_open === false && (
          <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center backdrop-blur-sm">
            <div className="text-white text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 animate-pulse" />
              <p className="text-sm font-bold arabic-text">مغلق مؤقتاً</p>
              <p className="text-xs opacity-80 arabic-text">سيتم فتحه قريباً</p>
            </div>
          </div>
        )}
        
        <div className="relative z-10 p-4 h-full flex flex-col justify-between text-white">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-bold text-lg arabic-text drop-shadow-lg leading-tight">
                  {category.name}
                </h3>
                {showSubCategories && (
                  <Badge className="bg-white/25 text-white text-xs px-2 py-1 backdrop-blur-sm border-white/30">
                    <Flame className="w-3 h-3 mr-1" />
                    مميز
                  </Badge>
                )}
              </div>
              {category.description && (
                <p className="text-white/90 text-sm leading-snug arabic-text drop-shadow-sm line-clamp-1">
                  {category.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {category.image_url ? (
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-2xl border-2 border-white/50 backdrop-blur-sm">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-white/25 rounded-xl flex items-center justify-center shadow-xl border-2 border-white/50 backdrop-blur-sm">
                  {showSubCategories ? (
                    <Store className="w-5 h-5 drop-shadow-md" />
                  ) : (
                    <Utensils className="w-5 h-5 drop-shadow-md" />
                  )}
                </div>
              )}
              
              {showSubCategories && (
                <div className="flex items-center space-x-1 text-white/90">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-medium">4.5</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center w-8 h-8 bg-white/25 rounded-full backdrop-blur-sm border border-white/50 group-hover:bg-white/35 group-hover:scale-110 transition-all duration-300">
              <ArrowLeft className="w-4 h-4 drop-shadow-md group-hover:translate-x-0.5 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
