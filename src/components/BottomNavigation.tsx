
import { Home, ShoppingCart, Settings, Search, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartItemCount: number;
}

export const BottomNavigation = ({ activeTab, onTabChange, cartItemCount }: BottomNavigationProps) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'الرئيسية', color: 'text-orange-500' },
    { id: 'search', icon: Search, label: 'البحث', color: 'text-blue-500' },
    { id: 'cart', icon: ShoppingCart, label: 'السلة', color: 'text-green-500' },
    { id: 'profile', icon: User, label: 'الحساب', color: 'text-purple-500' },
    { id: 'settings', icon: Settings, label: 'الإعدادات', color: 'text-gray-500' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-2xl z-50">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-3 relative transition-all duration-300 ${
                isActive
                  ? 'transform scale-110'
                  : 'hover:scale-105'
              }`}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full animate-pulse" />
              )}
              
              {/* Icon Container */}
              <div className={`relative p-2 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-orange-50 ' + tab.color
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}>
                <Icon className="w-6 h-6" />
                
                {/* Cart Badge */}
                {tab.id === 'cart' && cartItemCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-bounce">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </div>
                )}
              </div>
              
              {/* Label */}
              <span className={`text-xs font-medium mt-1 arabic-text transition-colors duration-300 ${
                isActive 
                  ? tab.color
                  : 'text-gray-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Bottom Safe Area */}
      <div className="h-safe-area-inset-bottom" />
    </div>
  );
};
