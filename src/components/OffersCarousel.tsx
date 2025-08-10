
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Flame, Gift, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OffersCarouselProps {
  onAddToCart?: (product: any, quantity?: number) => void;
}

export const OffersCarousel = ({ onAddToCart }: OffersCarouselProps) => {
  const [offers, setOffers] = useState<any[]>([]);
  const [currentOffer, setCurrentOffer] = useState(0);

  useEffect(() => {
    loadOffers();
  }, []);

  useEffect(() => {
    if (offers.length > 1) {
      const interval = setInterval(() => {
        setCurrentOffer(prev => (prev + 1) % offers.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [offers.length]);

  const loadOffers = async () => {
    try {
      const { data } = await supabase
        .from('offers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (data) {
        setOffers(data);
      }
    } catch (error) {
      console.error('Error loading offers:', error);
    }
  };

  if (offers.length === 0) return null;

  return (
    <div className="relative px-3 py-2">
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <div 
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentOffer * 100}%)` }}
        >
          {offers.map((offer, index) => (
            <div key={offer.id} className="w-full flex-shrink-0">
              <Card className="border-0 overflow-hidden shadow-lg">
                <CardContent className="p-0 relative">
                  {/* Dynamic Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-yellow-400/20"></div>
                  
                  {/* Animated Background Elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-2 right-2 w-12 h-12 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-2 left-2 w-8 h-8 bg-white/10 rounded-full blur-lg animate-bounce"></div>
                  </div>
                  
                  {/* Content مصغر */}
                  <div className="relative z-10 p-4 text-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-white/25 text-white backdrop-blur-sm border-white/30 arabic-text px-2 py-1 text-xs">
                            <Gift className="w-3 h-3 mr-1" />
                            عرض خاص
                          </Badge>
                          <Badge className="bg-yellow-400/90 text-yellow-900 backdrop-blur-sm border-0 arabic-text px-2 py-1 text-xs font-bold">
                            <Flame className="w-3 h-3 mr-1" />
                            جديد
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-bold mb-2 arabic-text drop-shadow-lg leading-tight">
                          {offer.title}
                        </h3>
                        <p className="text-white/95 mb-3 arabic-text leading-relaxed text-sm drop-shadow-md">
                          {offer.description}
                        </p>
                        
                        {offer.discount_percentage && (
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-xl font-bold text-sm shadow-lg">
                              خصم {offer.discount_percentage}%
                            </div>
                            <div className="flex items-center space-x-1 text-white/90">
                              <Zap className="w-4 h-4 text-yellow-300" />
                              <span className="font-medium arabic-text text-sm">وفر الآن</span>
                            </div>
                          </div>
                        )}
                        
                        <Button 
                          onClick={() => {
                            // إرسال مباشر للوتساب
                            const whatsappNumber = '201024713976';
                            const orderId = Date.now().toString().slice(-8);
                            const orderTime = new Date().toLocaleString('ar-EG', {
                              timeZone: 'Africa/Cairo',
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            });

                            let message = `📱 *طلب عرض خاص من Elfahd App*\n\n`;
                            message += `🆔 *رقم الطلب:* #${orderId}\n`;
                            message += `🕐 *وقت الطلب:* ${orderTime}\n`;
                            message += `🏪 *القسم:* العروض الخاصة\n\n`;
                            message += `🎁 *العرض:* ${offer.title}\n`;
                            message += `📝 *الوصف:* ${offer.description}\n`;
                            if (offer.discount_percentage) {
                              message += `💰 *الخصم:* ${offer.discount_percentage}%\n`;
                            }
                            message += `\n💳 *السعر:* سعر مميز - سيتم تحديده في المحادثة\n\n`;
                            message += `📞 *للاستفسار أو المتابعة:*\n`;
                            message += `• خدمة العملاء: 201024713976\n`;
                            message += `• اذكر رقم الطلب: #${orderId}\n\n`;
                            message += `📝 *ملاحظة:* يرجى تأكيد العرض وتحديد السعر والتفاصيل`;

                            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, '_blank');
                          }}
                          className="bg-white text-orange-600 hover:bg-white/90 font-bold px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 arabic-text text-sm"
                        >
                          اطلب الآن
                        </Button>
                      </div>
                      
                      {offer.image_url && (
                        <div className="w-16 h-16 rounded-2xl overflow-hidden ml-3 shadow-lg border-2 border-white/50 backdrop-blur-sm">
                          <img
                            src={offer.image_url}
                            alt={offer.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-white/90">
                        <Clock className="w-4 h-4" />
                        <span className="arabic-text font-medium text-sm">عرض محدود الوقت</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-300 fill-current" />
                        <span className="font-bold text-sm">عرض مميز</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      {/* Enhanced Indicators مصغر */}
      {offers.length > 1 && (
        <div className="flex justify-center mt-3 space-x-2">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentOffer(index)}
              className={`transition-all duration-500 rounded-full shadow-md ${
                index === currentOffer 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 w-8 h-3 shadow-orange-500/50' 
                  : 'bg-white/70 hover:bg-white/90 w-3 h-3 shadow-gray-300/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
