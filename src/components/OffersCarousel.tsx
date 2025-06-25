
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star } from 'lucide-react';

export const OffersCarousel = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [currentOffer, setCurrentOffer] = useState(0);

  useEffect(() => {
    loadOffers();
  }, []);

  useEffect(() => {
    if (offers.length > 1) {
      const interval = setInterval(() => {
        setCurrentOffer(prev => (prev + 1) % offers.length);
      }, 4000);
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
    <div className="relative mb-6">
      <div className="overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentOffer * 100}%)` }}
        >
          {offers.map((offer, index) => (
            <div key={offer.id} className="w-full flex-shrink-0">
              <Card className="talabat-card border-0 overflow-hidden">
                <CardContent className="p-0 relative">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 opacity-90" />
                  
                  {/* Content */}
                  <div className="relative z-10 p-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Badge className="bg-white/20 text-white mb-3 arabic-text">
                          عرض خاص
                        </Badge>
                        <h3 className="text-2xl font-bold mb-2 arabic-text">{offer.title}</h3>
                        <p className="text-white/90 mb-4 arabic-text leading-relaxed">{offer.description}</p>
                        
                        {offer.discount_percentage && (
                          <div className="flex items-center space-x-2">
                            <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold">
                              خصم {offer.discount_percentage}%
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {offer.image_url && (
                        <div className="w-24 h-24 rounded-2xl overflow-hidden ml-4 shadow-xl">
                          <img
                            src={offer.image_url}
                            alt={offer.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-white/80">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm arabic-text">عرض محدود</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm">عرض مميز</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-4 left-4 w-16 h-16 bg-white/10 rounded-full opacity-50" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/10 rounded-full opacity-30" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      {/* Indicators */}
      {offers.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentOffer(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentOffer 
                  ? 'bg-orange-500 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
