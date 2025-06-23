
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from '@/components/ui/card';

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
      }, 3000);
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
    <div className="relative">
      <Card className="overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="text-center">
            {offers[currentOffer]?.image_url && (
              <img
                src={offers[currentOffer].image_url}
                alt={offers[currentOffer].title}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-bold mb-2">{offers[currentOffer]?.title}</h3>
            <p className="text-green-100 mb-2">{offers[currentOffer]?.description}</p>
            {offers[currentOffer]?.discount_percentage && (
              <div className="text-2xl font-bold">
                خصم {offers[currentOffer].discount_percentage}%
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {offers.length > 1 && (
        <div className="flex justify-center mt-2 space-x-2">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentOffer(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentOffer ? 'bg-green-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
