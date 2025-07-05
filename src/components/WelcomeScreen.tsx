
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
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "توصيل سريع ومضمون",
      subtitle: "نوصل طلبك في أقل من 30 دقيقة",
      icon: "🚚",
      color: "from-purple-400 to-purple-600"
    },
    {
      title: "جودة عالية وأسعار مناسبة",
      subtitle: "أفضل المنتجات بأفضل الأسعار",
      icon: "⭐",
      color: "from-pink-400 to-pink-600"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col relative overflow-hidden">
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
        
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/85 via-white/90 to-pink-50/85" />
        
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
        <div className="w-28 h-28 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white">
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
                  ? 'bg-purple-500 w-12'
                  : 'bg-gray-300 w-4'
              }`}
            />
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-sm mb-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-xl border-2 border-white group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm text-gray-700 arabic-text font-bold">توصيل سريع</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-xl border-2 border-white group-hover:scale-110 transition-transform duration-300">
              <Star className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm text-gray-700 arabic-text font-bold">جودة عالية</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-xl border-2 border-white group-hover:scale-110 transition-transform duration-300">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm text-gray-700 arabic-text font-bold">خدمة 24/7</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 p-6 space-y-4">
        <Button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl py-6 arabic-text font-bold rounded-2xl shadow-2xl border-2 border-white hover:scale-105 transition-all duration-300"
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
