
import { MessageCircle, Globe, Store, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DeveloperContactProps {
  onBack?: () => void;
}

export const DeveloperContact = ({ onBack }: DeveloperContactProps) => {
  const handleContactDeveloper = () => {
    window.open('https://wa.me/201204486263?text=' + encodeURIComponent('أريد تطبيق أو موقع جديد'), '_blank');
  };

  const handleVisitWebsite = () => {
    window.open('https://alshbh.netlify.app', '_blank');
  };

  const handleAddStore = () => {
    window.open('https://wa.me/201204486263?text=' + encodeURIComponent('أريد إضافة متجري أو مطعمي للتطبيق'), '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {onBack && (
        <div className="pt-8 mb-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            العودة
          </Button>
        </div>
      )}
      
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
            التواصل مع المطور
          </h3>
          
          <div className="space-y-3">
            <Button
              onClick={handleContactDeveloper}
              className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="w-5 h-5" />
              التواصل مع المطور لطلب تطبيق أو موقع
            </Button>
            
            <Button
              onClick={handleVisitWebsite}
              variant="outline"
              className="w-full flex items-center justify-center gap-3"
            >
              <Globe className="w-5 h-5" />
              موقع المطور
            </Button>
            
            <Button
              onClick={handleAddStore}
              variant="outline"
              className="w-full flex items-center justify-center gap-3 border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <Store className="w-5 h-5" />
              أضف متجرك أو مطعمك في التطبيق
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
