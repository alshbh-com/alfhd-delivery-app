
import { useState, useEffect, useMemo } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Store, Utensils, Clock, ArrowRight } from 'lucide-react';

interface CategoriesGridProps {
  parentCategoryId?: string;
  onCategorySelect: (categoryId: string) => void;
  showSubCategories?: boolean;
  selectedSubCategory?: string | null;
}

export const CategoriesGrid = ({ 
  parentCategoryId, 
  onCategorySelect, 
  showSubCategories = false,
  selectedSubCategory 
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

  const filteredCategories = useMemo(() => {
    return selectedSubCategory && showSubCategories 
      ? categories.filter(cat => cat.id === selectedSubCategory)
      : categories;
  }, [selectedSubCategory, showSubCategories, categories]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-28"></div>
          ))}
        </div>
      </div>
    );
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

  return (
    <div className="space-y-4">
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
            {filteredCategories.length} {showSubCategories ? 'متجر' : 'فئة'}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {filteredCategories.map((category, index) => (
          <Card
            key={category.id}
            className={`relative cursor-pointer group transform transition-all duration-200 hover:scale-102 shadow-sm border-2 border-white ${
              !category.is_open ? 'opacity-70' : ''
            }`}
            onClick={() => {
              if (category.is_open !== false) {
                onCategorySelect(category.id);
              }
            }}
          >
            <CardContent className="p-0 relative overflow-hidden h-32">
              <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]}`} />
              
              {category.is_open === false && (
                <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Clock className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-sm font-bold">مغلق مؤقتاً</p>
                  </div>
                </div>
              )}
              
              <div className="relative z-10 p-3 h-full flex flex-col justify-between text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 arabic-text drop-shadow-md">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-white/90 text-xs leading-snug arabic-text drop-shadow-sm">
                        {category.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="w-8 h-8 bg-white/25 rounded-lg flex items-center justify-center ml-2 group-hover:bg-white/35 transition-colors">
                    {showSubCategories ? (
                      <Store className="w-4 h-4" />
                    ) : (
                      <Utensils className="w-4 h-4" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  {category.image_url ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg border-2 border-white/50">
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-white/25 rounded-lg flex items-center justify-center shadow-md border border-white/50">
                      <span className="text-xl font-bold drop-shadow-md">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <ArrowRight className="w-4 h-4 drop-shadow-md" />
                    <ChevronLeft className="w-3 h-3 drop-shadow-md" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredCategories.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
          <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-600 arabic-text text-lg font-bold mb-1">لا توجد فئات متاحة حالياً</p>
          <p className="text-gray-400 arabic-text">سيتم إضافة فئات جديدة قريباً</p>
        </div>
      )}
    </div>
  );
};
