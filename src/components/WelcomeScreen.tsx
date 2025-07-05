
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Star, Clock, Truck, Play, Pause } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen = ({ onContinue }: WelcomeScreenProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const slides = [
    {
      title: "أهلاً بك في Elfahd App",
      subtitle: "تطبيق الفهد - كل ما تحتاجه في مكان واحد",
      icon: "📱",
      color: "from-blue-500 to-teal-500"
    },
    {
      title: "توصيل سريع ومضمون",
      subtitle: "نوصل طلبك في أقل من 30 دقيقة",
      icon: "🚚",
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "جودة عالية وأسعار مناسبة",
      subtitle: "أفضل المنتجات بأفضل الأسعار",
      icon: "⭐",
      color: "from-orange-400 to-orange-600"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        setIsVideoPlaying(false);
      });
    }
  }, []);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col relative overflow-hidden">
      {/* Background Video - Real cooking video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover opacity-25"
          autoPlay
          muted
          loop
          playsInline
          onLoadStart={() => console.log('Video loading started')}
          onCanPlay={() => console.log('Video can play')}
        >
          <source src="https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          <source src="https://videos.pexels.com/video-files/2620043/2620043-uhd_2560_1440_30fps.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/85 via-white/90 to-blue-50/85" />
        
        <button
          onClick={toggleVideo}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          {isVideoPlaying ? (
            <Pause className="w-5 h-5 text-gray-700" />
          ) : (
            <Play className="w-5 h-5 text-gray-700 ml-0.5" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <div className="mb-8 animate-bounce">
        <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white">
          <span className="text-5xl">📱</span>
        </div>
        </div>

        {/* Slide Content */}
        <div className="text-center mb-12 px-4 max-w-md">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${slides[currentSlide].color} mb-6 shadow-2xl border-4 border-white animate-pulse`}>
            <span className="text-3xl">{slides[currentSlide].icon}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4 arabic-text animate-fade-in">
            {slides[currentSlide].title}
          </h1>
          
          <p className="text-xl text-gray-600 arabic-text leading-relaxed animate-fade-in">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* Slide Indicators */}
        <div className="flex space-x-3 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-4 rounded-full transition-all duration-500 border-2 border-white shadow-lg ${
                index === currentSlide
                  ? 'bg-blue-500 w-12'
                  : 'bg-gray-300 w-4'
              }`}
            />
          ))}
        </div>

        {/* Location Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-2xl mb-2">📍</div>
            <h3 className="font-bold text-yellow-800 mb-2 arabic-text">متاح في القليوبية فقط</h3>
            <p className="text-yellow-700 text-sm arabic-text leading-relaxed">
              تطبيق الفهد متاح حالياً لمحافظة القليوبية فقط<br/>
              قريباً سنوسع خدماتنا لتشمل جميع أنحاء مصر
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="relative z-10 p-6 space-y-4">
        <Button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-xl py-6 arabic-text font-bold rounded-2xl shadow-2xl border-2 border-white hover:scale-105 transition-all duration-300"
        >
          ادخل إلى Elfahd App
          <ChevronLeft className="mr-3 h-6 w-6" />
        </Button>
        
        <p className="text-center text-base text-gray-600 arabic-text font-medium">
          مرحباً بك في تطبيق الفهد - ابدأ تجربة تسوق رائعة
        </p>
      </div>
    </div>
  );
};
