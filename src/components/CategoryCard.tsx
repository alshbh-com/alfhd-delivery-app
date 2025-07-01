
import { Card, CardContent } from '@/components/ui/card';
import { Store, Utensils, Clock, ArrowRight, ChevronLeft } from 'lucide-react';

interface CategoryCardProps {
  category: any;
  index: number;
  showSubCategories: boolean;
  onCategorySelect: (categoryId: string) => void;
}

const gradients = [
  'from-orange-500 to-red-500',
  'from-blue-500 to-purple-500', 
  'from-green-500 to-teal-500',
  'from-yellow-500 to-orange-500',
  'from-purple-500 to-pink-500',
  'from-indigo-500 to-blue-500',
  'from-teal-500 to-green-500',
  'from-pink-500 to-red-500',
];

export const CategoryCard = ({ category, index, showSubCategories, onCategorySelect }: CategoryCardProps) => {
  return (
    <Card
      className={`relative cursor-pointer group transform transition-all duration-200 hover:scale-102 shadow-lg border-4 border-white/70 hover:border-white ${
        !category.is_open ? 'opacity-70' : ''
      }`}
      onClick={() => {
        if (category.is_open !== false) {
          onCategorySelect(category.id);
        }
      }}
    >
      <CardContent className="p-0 relative overflow-hidden h-24">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]}`} />
        
        {category.is_open === false && (
          <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
            <div className="text-white text-center">
              <Clock className="w-4 h-4 mx-auto mb-1" />
              <p className="text-xs font-bold">مغلق مؤقتاً</p>
            </div>
          </div>
        )}
        
        <div className="relative z-10 p-2 h-full flex flex-col justify-between text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1 arabic-text drop-shadow-md">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-white/90 text-xs leading-snug arabic-text drop-shadow-sm line-clamp-2">
                  {category.description}
                </p>
              )}
            </div>
            
            <div className="w-6 h-6 bg-white/25 rounded-lg flex items-center justify-center ml-1 group-hover:bg-white/35 transition-colors">
              {showSubCategories ? (
                <Store className="w-3 h-3" />
              ) : (
                <Utensils className="w-3 h-3" />
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            {category.image_url ? (
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg border border-white/50">
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 bg-white/25 rounded-lg flex items-center justify-center shadow-md border border-white/50">
                <span className="text-sm font-bold drop-shadow-md">
                  {category.name.charAt(0)}
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <ArrowRight className="w-3 h-3 drop-shadow-md" />
              <ChevronLeft className="w-2 h-2 drop-shadow-md" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
