
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <MapPin className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">اختر منطقتك</h2>
          <p className="text-gray-600">يرجى اختيار المنطقة للتأكد من إمكانية التوصيل</p>
        </div>

        <div className="space-y-4">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="text-right">
              <SelectValue placeholder="اختر المنطقة" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.name} className="text-right">
                  {city.name} - رسوم التوصيل: {city.delivery_price} جنيه
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={handleConfirm}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
            disabled={!selectedCity}
          >
            تأكيد الموقع
          </Button>
        </div>
      </div>
    </div>
  );
};
