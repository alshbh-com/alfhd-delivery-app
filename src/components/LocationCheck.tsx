
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LocationCheckProps {
  onLocationConfirm: (city: string) => void;
}

export const LocationCheck = ({ onLocationConfirm }: LocationCheckProps) => {
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const { data } = await supabase
        .from('allowed_cities')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (data) {
        setCities(data);
      }
    } catch (error) {
      console.error('Error loading cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedCity) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار المنطقة أولاً",
        variant: "destructive"
      });
      return;
    }
    onLocationConfirm(selectedCity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">طلبيات</h1>
          <p className="text-gray-600">أسرع خدمة توصيل في المنصورة</p>
        </div>

        {/* إشعار المنصورة */}
        <Alert className="bg-blue-50 border-blue-200 shadow-lg">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 font-medium">
            📍 الخدمة متاحة حالياً في محافظة المنصورة فقط
            <br />
            🚀 قريباً سيتم التوسع لباقي محافظات مصر
          </AlertDescription>
        </Alert>

        {/* Location Selection Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-orange-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">اختر منطقتك</h2>
            <p className="text-gray-600">حدد منطقتك للتأكد من إمكانية التوصيل</p>
          </div>

          <div className="space-y-6">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="text-right h-12 border-2 border-orange-200 focus:border-orange-400 rounded-xl">
                <SelectValue placeholder="اختر المنطقة" />
              </SelectTrigger>
              <SelectContent className="bg-white border-orange-200">
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.name} className="text-right hover:bg-orange-50">
                    <div className="flex justify-between items-center w-full">
                      <span>{city.name}</span>
                      <span className="text-green-600 font-semibold mr-4">
                        {city.delivery_price} جنيه توصيل
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={handleConfirm}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              disabled={!selectedCity}
            >
              🛍️ ابدأ التسوق الآن
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center text-sm text-gray-500">
          <p>خدمة التوصيل متاحة طوال أيام الأسبوع</p>
          <p>من الساعة 9 صباحاً حتى 11 مساءً</p>
        </div>
      </div>
    </div>
  );
};
