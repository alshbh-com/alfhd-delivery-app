
import { MessageCircle, Globe, Store } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const DeveloperContact = () => {
  const handleContactDeveloper = () => {
    window.open('https://wa.me/201204486263?text=أريد تطبيق أو موقع جديد', '_blank');
  };

  const handleVisitWebsite = () => {
    window.open('https://alshbh.netlify.app', '_blank');
  };

  const handleAddStore = () => {
    window.open('https://wa.me/201204486263?text=أريد إضافة متجري أو مطعمي للتطبيق', '_blank');
  };

  return (
    <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50">
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
  );
};
