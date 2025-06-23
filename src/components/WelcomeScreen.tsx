
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen = ({ onContinue }: WelcomeScreenProps) => {
  const [welcomeMessage, setWelcomeMessage] = useState('مرحباً بكم في متجر الفهد');
  const [welcomeImage, setWelcomeImage] = useState('');

  useEffect(() => {
    loadWelcomeData();
  }, []);

  const loadWelcomeData = async () => {
    try {
      const { data } = await supabase
        .from('app_settings')
        .select('key, value')
        .in('key', ['welcome_message', 'welcome_image']);
      
      data?.forEach(setting => {
        if (setting.key === 'welcome_message' && setting.value) {
          setWelcomeMessage(setting.value);
        }
        if (setting.key === 'welcome_image' && setting.value) {
          setWelcomeImage(setting.value);
        }
      });
    } catch (error) {
      console.error('Error loading welcome data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md w-full">
        <div className="mb-6">
          {welcomeImage ? (
            <img 
              src={welcomeImage} 
              alt="شعار المتجر" 
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-32 h-32 mx-auto bg-green-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
              الفهد
            </div>
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {welcomeMessage}
        </h1>
        
        <p className="text-gray-600 mb-8">
          متجرك المفضل للتوصيل السريع
        </p>
        
        <Button 
          onClick={onContinue}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
        >
          ابدأ التسوق الآن
        </Button>
      </div>
    </div>
  );
};
