
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Truck, Info } from 'lucide-react';

export const DeliveryNotice = () => {
  return (
    <Alert className="mb-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <AlertDescription className="arabic-text text-orange-800 font-medium leading-relaxed">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 mt-1 text-orange-600 flex-shrink-0" />
              <div>
                <p className="font-bold mb-1">📢 إشعار مهم</p>
                <p>
                  حالياً كل مطعم ومتجر له خدمة توصيل خاصة به، لحين الانتهاء من تدريب فريق طلبيات المختص. 
                  سيتم توحيد خدمة التوصيل قريباً لتجربة أفضل! 🚀
                </p>
              </div>
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};
