
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Store, Utensils } from 'lucide-react';

interface CategoriesGridProps {
  parentCategoryId?: string;
  onCategorySelect: (categoryId: string) => void;
  showSubCategories?: boolean;
}

export const CategoriesGrid = ({ 
  parentCategoryId, 
  onCategorySelect, 
  showSubCategories = false 
}: CategoriesGridProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, [parentCategoryId, showSubCategories]);

  const loadCategories = async () => {
    try {
      let query;
      
      if (showSubCategories && parentCategoryId) {
        query = supabase
          .from('sub_categories')
          .select('*')
          .eq('main_category_id', parentCategoryId)
          .eq('is_active', true)
          .order('sort_order');
      } else {
        query = supabase
          .from('main_categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');
      }
      
      const { data } = await query;
      
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-48" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-36"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const gradients = [
    'from-blue-400 to-purple-500',
    'from-green-400 to-teal-500',
    'from-orange-400 to-red-500',
    'from-pink-400 to-purple-500',
    'from-yellow-400 to-orange-500',
    'from-indigo-400 to-blue-500',
    'from-teal-400 to-green-500',
    'from-red-400 to-pink-500',
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 arabic-text">
            {showSubCategories ? 'المتاجر والمطاعم' : 'تصفح حسب الفئة'}
          </h2>
          <p className="text-gray-600 mt-1 arabic-text">
            {showSubCategories ? 'اختر المتجر المفضل لديك' : 'اختر الفئة التي تريد التسوق منها'}
          </p>
        </div>
        
        {!showSubCategories && (
          <Badge variant="secondary" className="arabic-text">
            {categories.length} فئة
          </Badge>
        )}
      </div>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category, index) => (
          <Card
            key={category.id}
            className="category-card cursor-pointer group"
            onClick={() => onCategorySelect(category.id)}
          >
            <CardContent className="p-0 relative overflow-hidden">
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-90`} />
              
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 right-2 w-16 h-16 border-2 border-white rounded-full" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-2 border-white rounded-full" />
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-4 h-36 flex flex-col justify-between text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 arabic-text group-hover:scale-105 transition-transform duration-300">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-white/90 text-xs leading-relaxed arabic-text">
                        {category.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-2 group-hover:scale-110 transition-transform duration-300">
                    {showSubCategories ? (
                      <Store className="w-5 h-5" />
                    ) : (
                      <Utensils className="w-5 h-5" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  {category.image_url ? (
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <ChevronLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-600 arabic-text text-lg">لا توجد فئات متاحة حالياً</p>
          <p className="text-gray-400 arabic-text text-sm mt-2">سيتم إضافة فئات جديدة قريباً</p>
        </div>
      )}
    </div>
  );
};
