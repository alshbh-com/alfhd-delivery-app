
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Star, Clock, Truck } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen = ({ onContinue }: WelcomeScreenProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "أهلاً بك في طلبيات",
      subtitle: "أسرع خدمة توصيل في منطقتك",
      icon: "🛍️",
      color: "from-orange-400 to-red-400"
    },
    {
      title: "توصيل سريع ومضمون",
      subtitle: "نوصل طلبك في أقل من 30 دقيقة",
      icon: "🚚",
      color: "from-blue-400 to-purple-400"
    },
    {
      title: "جودة عالية وأسعار مناسبة",
      subtitle: "أفضل المنتجات بأفضل الأسعار",
      icon: "⭐",
      color: "from-green-400 to-teal-400"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-lg">
            <span className="text-4xl">🛍️</span>
          </div>
        </div>

        {/* Slide Content */}
        <div className="text-center mb-12 px-4 max-w-md">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${slides[currentSlide].color} mb-6 shadow-lg`}>
            <span className="text-2xl">{slides[currentSlide].icon}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4 arabic-text">
            {slides[currentSlide].title}
          </h1>
          
          <p className="text-lg text-gray-600 arabic-text leading-relaxed">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* Slide Indicators */}
        <div className="flex space-x-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-orange-500 w-8'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-xs text-gray-700 arabic-text font-medium">توصيل سريع</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xs text-gray-700 arabic-text font-medium">جودة عالية</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-xs text-gray-700 arabic-text font-medium">خدمة 24/7</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-6 space-y-4">
        <Button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg py-4 arabic-text font-semibold rounded-xl shadow-lg"
        >
          ابدأ التسوق الآن
          <ChevronLeft className="mr-2 h-5 w-5" />
        </Button>
        
        <p className="text-center text-sm text-gray-600 arabic-text">
          اضغط للمتابعة وابدأ تجربة تسوق رائعة
        </p>
      </div>
    </div>
  );
};
