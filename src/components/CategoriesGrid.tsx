
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

  // Memoize filtered categories for better performance
  const filteredCategories = useMemo(() => {
    return selectedSubCategory && showSubCategories 
      ? categories.filter(cat => cat.id === selectedSubCategory)
      : categories;
  }, [selectedSubCategory, showSubCategories, categories]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-48" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-3xl h-40"></div>
          ))}
        </div>
      </div>
    );
  }

  const gradients = [
    'from-orange-500 via-red-500 to-pink-500',
    'from-blue-500 via-purple-500 to-indigo-500',
    'from-green-500 via-teal-500 to-cyan-500',
    'from-yellow-500 via-orange-500 to-red-500',
    'from-purple-500 via-pink-500 to-red-500',
    'from-indigo-500 via-blue-500 to-cyan-500',
    'from-teal-500 via-green-500 to-lime-500',
    'from-pink-500 via-red-500 to-orange-500',
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Section Header */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 arabic-text mb-2">
              {showSubCategories ? '🏪 المتاجر والمطاعم' : '🍽️ تصفح حسب الفئة'}
            </h2>
            <p className="text-gray-600 text-lg arabic-text">
              {showSubCategories ? 'اختر المتجر المفضل لديك' : 'اختر الفئة التي تريد التسوق منها'}
            </p>
          </div>
          
          <Badge variant="secondary" className="arabic-text text-lg px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-2 border-orange-200">
            {filteredCategories.length} {showSubCategories ? 'متجر' : 'فئة'}
          </Badge>
        </div>
      </div>
      
      {/* Enhanced Categories Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredCategories.map((category, index) => (
          <Card
            key={category.id}
            className={`relative overflow-hidden cursor-pointer group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-3 border-white shadow-xl ${
              !category.is_open ? 'opacity-70' : ''
            }`}
            onClick={() => {
              if (category.is_open !== false) {
                onCategorySelect(category.id);
              }
            }}
          >
            <CardContent className="p-0 relative overflow-hidden h-44">
              {/* Enhanced Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]}`} />
              
              {/* Dynamic Pattern Overlay */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-3 right-3 w-20 h-20 border-4 border-white rounded-full animate-pulse" />
                <div className="absolute bottom-3 left-3 w-12 h-12 border-4 border-white rounded-full animate-pulse" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white rounded-full opacity-50" />
              </div>
              
              {/* Closed Status Overlay */}
              {category.is_open === false && (
                <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-white text-center animate-pulse">
                    <Clock className="w-10 h-10 mx-auto mb-3" />
                    <p className="text-lg font-bold">مغلق مؤقتاً</p>
                    <p className="text-sm opacity-80">سيفتح قريباً</p>
                  </div>
                </div>
              )}
              
              {/* Enhanced Content */}
              <div className="relative z-10 p-5 h-full flex flex-col justify-between text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2 arabic-text group-hover:scale-105 transition-transform duration-300 drop-shadow-lg">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-white/95 text-sm leading-relaxed arabic-text drop-shadow-md">
                        {category.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="w-12 h-12 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center ml-3 group-hover:scale-110 group-hover:bg-white/35 transition-all duration-300 shadow-lg">
                    {showSubCategories ? (
                      <Store className="w-6 h-6" />
                    ) : (
                      <Utensils className="w-6 h-6" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  {category.image_url ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl border-3 border-white/50">
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/50">
                      <span className="text-3xl font-bold drop-shadow-lg">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300 drop-shadow-lg" />
                    <ChevronLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 drop-shadow-lg" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Enhanced Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl shadow-xl border-2 border-gray-100">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Store className="w-16 h-16 text-gray-400" />
          </div>
          <p className="text-gray-600 arabic-text text-2xl font-bold mb-2">لا توجد فئات متاحة حالياً</p>
          <p className="text-gray-400 arabic-text text-lg">سيتم إضافة فئات جديدة قريباً</p>
        </div>
      )}
    </div>
  );
};
