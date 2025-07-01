
import { Store } from 'lucide-react';

export const EmptyState = () => {
  return (
    <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
      <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Store className="w-12 h-12 text-gray-400" />
      </div>
      <p className="text-gray-600 arabic-text text-lg font-bold mb-1">لا توجد فئات متاحة حالياً</p>
      <p className="text-gray-400 arabic-text">سيتم إضافة فئات جديدة قريباً</p>
    </div>
  );
};
