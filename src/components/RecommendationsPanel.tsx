import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Clock, Heart } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface RecommendationsPanelProps {
  userId?: string;
  onAddToCart: (product: any) => void;
}

export const RecommendationsPanel = ({ userId, onAddToCart }: RecommendationsPanelProps) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [favoriteStores, setFavoriteStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [userId]);

  const loadRecommendations = async () => {
    try {
      // تحميل المنتجات الشائعة
      const { data: trending } = await supabase
        .from('products')
        .select(`
          *,
          sub_categories (
            id,
            name,
            image_url
          )
        `)
        .eq('is_active', true)
        .order('review_count', { ascending: false })
        .limit(6);

      setTrendingProducts(trending || []);

      // تحميل المتاجر المفضلة (الأعلى تقييماً)
      const { data: stores } = await supabase
        .from('sub_categories')
        .select('*')
        .eq('is_active', true)
        .order('average_rating', { ascending: false })
        .limit(4);

      setFavoriteStores(stores || []);

      // إذا كان هناك مستخدم، تحميل التوصيات الشخصية
      if (userId) {
        await loadPersonalizedRecommendations();
      } else {
        // توصيات عامة للزوار
        const { data: general } = await supabase
          .from('products')
          .select(`
            *,
            sub_categories (
              id,
              name,
              image_url
            )
          `)
          .eq('is_active', true)
          .gte('average_rating', 4)
          .order('average_rating', { ascending: false })
          .limit(8);

        setRecommendations(general || []);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPersonalizedRecommendations = async () => {
    try {
      // جلب تفضيلات المستخدم
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (preferences) {
        // توصيات بناءً على الفئات المفضلة
        const favoriteCategories = Array.isArray(preferences.favorite_categories) ? preferences.favorite_categories : [];
        const favoriteSubCategories = Array.isArray(preferences.favorite_sub_categories) ? preferences.favorite_sub_categories : [];

        let query = supabase
          .from('products')
          .select(`
            *,
            sub_categories (
              id,
              name,
              image_url,
              main_category_id
            )
          `)
          .eq('is_active', true);

        if (favoriteSubCategories.length > 0) {
          query = query.in('sub_category_id', favoriteSubCategories as string[]);
        }

        const { data: personalized } = await query
          .order('average_rating', { ascending: false })
          .limit(8);

        setRecommendations(personalized || []);
      }
    } catch (error) {
      console.error('Error loading personalized recommendations:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map(j => (
                  <div key={j} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* التوصيات الشخصية */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 arabic-text">
              <Heart className="w-5 h-5 text-red-500" />
              {userId ? 'مخصص لك' : 'الأعلى تقييماً'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {recommendations.slice(0, 4).map((product) => (
                <div key={product.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                  <div className="w-full h-16 bg-gray-200 rounded-lg mb-2"></div>
                  <h4 className="font-medium text-sm arabic-text line-clamp-1">{product.name}</h4>
                  <p className="text-xs text-gray-600 arabic-text line-clamp-1">
                    {product.sub_categories?.name}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{product.average_rating?.toFixed(1) || '0.0'}</span>
                    </div>
                    <span className="text-sm font-bold text-primary">{product.price} ر.س</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAddToCart(product)}
                    className="w-full mt-2 text-xs arabic-text"
                  >
                    إضافة
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* الشائع الآن */}
      {trendingProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 arabic-text">
              <TrendingUp className="w-5 h-5 text-green-500" />
              شائع الآن
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendingProducts.slice(0, 3).map((product, index) => (
                <div key={product.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <Badge variant={index === 0 ? "default" : "secondary"} className="text-xs">
                    {index + 1}
                  </Badge>
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm arabic-text truncate">{product.name}</h4>
                    <p className="text-xs text-gray-600 arabic-text truncate">
                      {product.sub_categories?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{product.price} ر.س</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddToCart(product)}
                      className="text-xs mt-1"
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* المتاجر المفضلة */}
      {favoriteStores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 arabic-text">
              <Star className="w-5 h-5 text-yellow-500" />
              متاجر مميزة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {favoriteStores.slice(0, 4).map((store) => (
                <div key={store.id} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3">
                  <div className="w-full h-12 bg-gray-200 rounded-lg mb-2"></div>
                  <h4 className="font-medium text-sm arabic-text line-clamp-1">{store.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{store.average_rating?.toFixed(1) || '0.0'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{store.delivery_time_min || 30} د</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};