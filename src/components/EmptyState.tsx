
import { Store, Sparkles } from 'lucide-react';

export const EmptyState = () => {
  return (
    <div className="text-center py-16 bg-white rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl relative">
          <Store className="w-16 h-16 text-white" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-900" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 arabic-text mb-3">لا توجد فئات متاحة حالياً</h3>
        <p className="text-gray-500 arabic-text text-lg leading-relaxed mb-4">
          نعمل على إضافة المزيد من الفئات المميزة
        </p>
        <p className="text-gray-400 arabic-text">ستكون متاحة قريباً... ترقب الجديد!</p>
        
        {/* Animated Dots */}
        <div className="flex justify-center space-x-1 mt-6">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};
