
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { LocationCheck } from '@/components/LocationCheck';
import { MainApp } from '@/components/MainApp';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [isAppClosed, setIsAppClosed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAppStatus();
  }, []);

  const checkAppStatus = async () => {
    try {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'app_open')
        .single();
      
      if (data?.value === 'false') {
        setIsAppClosed(true);
      }
    } catch (error) {
      console.error('Error checking app status:', error);
    }
  };

  const handleWelcomeContinue = () => {
    setShowWelcome(false);
  };

  const handleLocationConfirm = (city: string) => {
    setSelectedCity(city);
    setIsLocationValid(true);
    toast({
      title: "تم تأكيد الموقع",
      description: `سيتم التوصيل إلى ${city}`,
    });
  };

  if (isAppClosed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🕐</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">التطبيق مغلق حالياً</h1>
          <p className="text-gray-600">سيتم فتح التطبيق الساعة 10:00 صباحاً</p>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return <WelcomeScreen onContinue={handleWelcomeContinue} />;
  }

  if (!isLocationValid) {
    return <LocationCheck onLocationConfirm={handleLocationConfirm} />;
  }

  return <MainApp selectedCity={selectedCity} />;
};

export default Index;
