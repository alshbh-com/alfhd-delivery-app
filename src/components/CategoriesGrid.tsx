
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from '@/components/ui/card';

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
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-32"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">
        {showSubCategories ? 'المتاجر والمطاعم' : 'الأقسام الرئيسية'}
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onCategorySelect(category.id)}
          >
            <CardContent className="p-4 text-center">
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-24 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="w-full h-24 bg-green-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-green-600 text-2xl font-bold">
                    {category.name.charAt(0)}
                  </span>
                </div>
              )}
              <h3 className="font-semibold text-gray-800">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
