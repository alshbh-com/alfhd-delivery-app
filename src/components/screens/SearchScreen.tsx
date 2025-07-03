import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Filter, SlidersHorizontal, Star, Clock, MapPin, Heart, Mic, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SearchScreenProps {
  onAddToCart: (product: any, quantity?: number) => void;
  onBack: () => void;
}

interface SearchFilters {
  priceRange: [number, number];
  rating: number;
  deliveryTime: number;
  cuisineType: string;
  paymentMethods: string[];
  dietary: string[];
  sortBy: string;
}

export const SearchScreen = ({ onAddToCart, onBack }: SearchScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: [0, 500],
    rating: 0,
    deliveryTime: 120,
    cuisineType: '',
    paymentMethods: [],
    dietary: [],
    sortBy: 'relevance'
  });

  // البحث الذكي مع الاقتراحات
  const searchWithSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) return;

    try {
      const { data: productSuggestions } = await supabase
        .from('products')
        .select('name')
        .textSearch('name', query)
        .limit(5);

      const { data: storeSuggestions } = await supabase
        .from('sub_categories')
        .select('name')
        .textSearch('name', query)
        .limit(5);

      const allSuggestions = [
        ...(productSuggestions?.map(p => p.name) || []),
        ...(storeSuggestions?.map(s => s.name) || [])
      ];

      setSuggestions([...new Set(allSuggestions)]);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, []);

  // البحث المتقدم مع الفلاتر
  const performSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          sub_categories (
            id,
            name,
            average_rating,
            delivery_time_min,
            delivery_time_max,
            cuisine_type,
            payment_methods,
            delivery_fee
          )
        `)
        .eq('is_active', true);

      // البحث النصي
      if (searchQuery) {
        query = query.textSearch('name', searchQuery);
      }

      // فلتر السعر
      query = query
        .gte('price', filters.priceRange[0])
        .lte('price', filters.priceRange[1]);

      // فلتر التقييم
      if (filters.rating > 0) {
        query = query.gte('average_rating', filters.rating);
      }

      // الترتيب
      switch (filters.sortBy) {
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('average_rating', { ascending: false });
          break;
        case 'popular':
          query = query.order('review_count', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      // فلترة إضافية حسب نوع المطبخ ووقت التوصيل
      let filteredData = data || [];

      if (filters.cuisineType) {
        filteredData = filteredData.filter(product => 
          product.sub_categories?.cuisine_type === filters.cuisineType
        );
      }

      if (filters.deliveryTime < 120) {
        filteredData = filteredData.filter(product => 
          (product.sub_categories?.delivery_time_max || 60) <= filters.deliveryTime
        );
      }

      setSearchResults(filteredData);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "خطأ في البحث",
        description: "حدث خطأ أثناء البحث. حاول مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, toast]);

  // البحث الصوتي
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "البحث الصوتي غير مدعوم",
        description: "متصفحك لا يدعم البحث الصوتي",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: "خطأ في البحث الصوتي",
        description: "حدث خطأ أثناء البحث الصوتي",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchWithSuggestions(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchWithSuggestions]);

  useEffect(() => {
    if (searchQuery) {
      performSearch();
    }
  }, [filters, performSearch]);

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 500],
      rating: 0,
      deliveryTime: 120,
      cuisineType: '',
      paymentMethods: [],
      dietary: [],
      sortBy: 'relevance'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 pb-6 pt-12">
        <div className="px-4">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white arabic-text">البحث المتقدم</h1>
          </div>

          {/* شريط البحث */}
          <div className="relative">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن المطاعم والمنتجات..."
                  className="flex-1 border-none bg-transparent focus:ring-0 arabic-text"
                  onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                />
                
                {/* البحث الصوتي */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={startVoiceSearch}
                  className={`${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400'} hover:text-primary`}
                >
                  <Mic className="w-5 h-5" />
                </Button>

                {/* فلاتر */}
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
                      <SlidersHorizontal className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="arabic-text">فلاتر البحث</SheetTitle>
                    </SheetHeader>
                    
                    <div className="space-y-6 mt-6">
                      {/* نطاق السعر */}
                      <div>
                        <label className="text-sm font-medium arabic-text">نطاق السعر</label>
                        <div className="mt-2">
                          <Slider
                            value={filters.priceRange}
                            onValueChange={(value) => setFilters({...filters, priceRange: value as [number, number]})}
                            max={500}
                            step={10}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{filters.priceRange[0]} ر.س</span>
                            <span>{filters.priceRange[1]} ر.س</span>
                          </div>
                        </div>
                      </div>

                      {/* التقييم */}
                      <div>
                        <label className="text-sm font-medium arabic-text">التقييم الأدنى</label>
                        <div className="flex gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Button
                              key={rating}
                              variant={filters.rating >= rating ? "default" : "outline"}
                              size="sm"
                              onClick={() => setFilters({...filters, rating})}
                              className="p-2"
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* وقت التوصيل */}
                      <div>
                        <label className="text-sm font-medium arabic-text">وقت التوصيل الأقصى</label>
                        <Select value={filters.deliveryTime.toString()} onValueChange={(value) => setFilters({...filters, deliveryTime: parseInt(value)})}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 دقيقة</SelectItem>
                            <SelectItem value="45">45 دقيقة</SelectItem>
                            <SelectItem value="60">ساعة واحدة</SelectItem>
                            <SelectItem value="90">ساعة ونصف</SelectItem>
                            <SelectItem value="120">ساعتان</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* نوع المطبخ */}
                      <div>
                        <label className="text-sm font-medium arabic-text">نوع المطبخ</label>
                        <Select value={filters.cuisineType} onValueChange={(value) => setFilters({...filters, cuisineType: value})}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="اختر نوع المطبخ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">الكل</SelectItem>
                            <SelectItem value="عربي">عربي</SelectItem>
                            <SelectItem value="إيطالي">إيطالي</SelectItem>
                            <SelectItem value="آسيوي">آسيوي</SelectItem>
                            <SelectItem value="أمريكي">أمريكي</SelectItem>
                            <SelectItem value="هندي">هندي</SelectItem>
                            <SelectItem value="مكسيكي">مكسيكي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* الترتيب */}
                      <div>
                        <label className="text-sm font-medium arabic-text">ترتيب النتائج</label>
                        <Select value={filters.sortBy} onValueChange={(value) => setFilters({...filters, sortBy: value})}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="relevance">الأكثر صلة</SelectItem>
                            <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                            <SelectItem value="popular">الأكثر شعبية</SelectItem>
                            <SelectItem value="price_low">السعر: من الأقل للأعلى</SelectItem>
                            <SelectItem value="price_high">السعر: من الأعلى للأقل</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* مسح الفلاتر */}
                      <Button onClick={clearFilters} variant="outline" className="w-full arabic-text">
                        مسح جميع الفلاتر
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* الاقتراحات */}
              {suggestions.length > 0 && searchQuery && (
                <div className="mt-3 space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(suggestion)}
                      className="block w-full text-right p-2 rounded-lg hover:bg-gray-100 text-sm arabic-text"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* النتائج */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600 arabic-text">جاري البحث...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600 arabic-text">
                تم العثور على {searchResults.length} نتيجة
              </p>
              <Badge variant="secondary" className="arabic-text">
                {searchQuery}
              </Badge>
            </div>

            <div className="grid gap-3">
              {searchResults.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <h3 className="font-semibold arabic-text">{product.name}</h3>
                        <p className="text-sm text-gray-600 arabic-text">
                          {product.sub_categories?.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {product.average_rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{product.average_rating.toFixed(1)}</span>
                            </div>
                          )}
                          {product.sub_categories?.delivery_time_min && (
                            <div className="flex items-center gap-1 text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">
                                {product.sub_categories.delivery_time_min}-{product.sub_categories.delivery_time_max} د
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-primary">{product.price} ر.س</p>
                        <Button
                          size="sm"
                          onClick={() => onAddToCart(product)}
                          className="mt-2 arabic-text"
                        >
                          إضافة
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : searchQuery ? (
          <div className="text-center py-8">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 arabic-text mb-2">
              لم يتم العثور على نتائج
            </h3>
            <p className="text-gray-500 arabic-text">
              جرب البحث بكلمات مختلفة أو قم بتعديل الفلاتر
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 arabic-text mb-2">
              ابحث عن مطعمك المفضل
            </h3>
            <p className="text-gray-500 arabic-text">
              اكتب في شريط البحث أعلاه للبدء
            </p>
          </div>
        )}
      </div>
    </div>
  );
};