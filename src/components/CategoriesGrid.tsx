
import { useState, useEffect, useMemo } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { CategoryCard } from '@/components/CategoryCard';
import { CategoryGridHeader } from '@/components/CategoryGridHeader';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';

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
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      <CategoryGridHeader 
        showSubCategories={showSubCategories}
        categoriesCount={filteredCategories.length}
      />
      
      <div className="grid grid-cols-2 gap-3">
        {filteredCategories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            index={index}
            showSubCategories={showSubCategories}
            onCategorySelect={onCategorySelect}
          />
        ))}
      </div>
      
      {filteredCategories.length === 0 && <EmptyState />}
    </div>
  );
};
