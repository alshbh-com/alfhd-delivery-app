
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Truck, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      <div className="min-h-screen talabat-gradient flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-6"></div>
          <p className="text-xl font-semibold arabic-text">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen talabat-gradient flex items-center justify-center p-4">
      <div className="floating-card p-8 max-w-lg w-full mx-4 animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3 arabic-text">اختر منطقتك</h1>
          <p className="text-gray-600 text-lg arabic-text">حدد موقعك للحصول على أفضل خدمة توصيل</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="talabat-input h-14 text-lg font-medium text-right pr-12">
                <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500" />
                <SelectValue placeholder="اختر المنطقة" className="arabic-text" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-orange-100 rounded-xl shadow-2xl">
                {cities.map((city) => (
                  <SelectItem 
                    key={city.id} 
                    value={city.name} 
                    className="text-right py-4 px-6 hover:bg-orange-50 arabic-text"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Truck className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-semibold">{city.delivery_price} جنيه</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-800">{city.name}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleConfirm}
            className="talabat-button w-full h-14 text-lg font-bold arabic-text"
            disabled={!selectedCity}
          >
            <MapPin className="ml-3 w-6 h-6" />
            تأكيد الموقع والبدء في التسوق
          </Button>

          {selectedCity && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center animate-fade-in">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <Truck className="w-5 h-5" />
                <span className="font-semibold arabic-text">
                  رسوم التوصيل: {cities.find(c => c.name === selectedCity)?.delivery_price} جنيه
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="arabic-text">توصيل سريع</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span className="arabic-text">خدمة مضمونة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
