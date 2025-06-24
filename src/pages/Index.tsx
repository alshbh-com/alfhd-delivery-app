
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { LocationCheck } from '@/components/LocationCheck';
import { MainApp } from '@/components/MainApp';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { PasswordDialog } from '@/components/admin/PasswordDialog';

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [isAppClosed, setIsAppClosed] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [showAdminButton, setShowAdminButton] = useState(false);
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

  const handleAdminSuccess = async () => {
    setShowAdminDialog(false);
    try {
      await supabase
        .from('app_settings')
        .upsert({ key: 'app_open', value: 'true' }, { onConflict: 'key' });
      
      setIsAppClosed(false);
      toast({
        title: "تم فتح التطبيق بنجاح",
        description: "التطبيق متاح الآن للجميع",
      });
    } catch (error) {
      console.error('Error opening app:', error);
      toast({
        title: "حدث خطأ",
        description: "فشل في فتح التطبيق",
        variant: "destructive"
      });
    }
  };

  const handleSecretClick = () => {
    setShowAdminButton(true);
    setTimeout(() => setShowAdminButton(false), 5000); // إخفاء الزر بعد 5 ثواني
  };

  if (isAppClosed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full relative">
          <div className="text-6xl mb-4">🕐</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">التطبيق مغلق حالياً</h1>
          <p className="text-gray-600">سيتم فتح التطبيق الساعة 10:00 صباحاً</p>
          
          {/* منطقة سرية للضغط عليها لإظهار زر الإدارة */}
          <div 
            className="absolute bottom-4 left-4 w-8 h-8 opacity-0 cursor-pointer"
            onClick={handleSecretClick}
          />
          
          {/* زر الإدارة المخفي */}
          {showAdminButton && (
            <div className="mt-6">
              <Button
                onClick={() => setShowAdminDialog(true)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Shield className="w-4 h-4 ml-1" />
                دخول الإدارة
              </Button>
            </div>
          )}
        </div>

        <PasswordDialog
          isOpen={showAdminDialog}
          onClose={() => setShowAdminDialog(false)}
          onSuccess={handleAdminSuccess}
          type="admin"
        />
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
