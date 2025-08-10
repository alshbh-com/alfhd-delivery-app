
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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Background with gradient */}
      <div className="absolute inset-0 rounded-t-3xl shadow-2xl" 
           style={{
             background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(254,247,240,0.98) 100%)',
             backdropFilter: 'blur(20px)',
             borderTop: '2px solid rgba(251, 146, 60, 0.1)'
           }}>
      </div>
      
      {/* Content مصغر */}
      <div className="relative px-2 py-1">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center py-1 px-2 relative transition-all duration-300 ${
                  isActive
                    ? 'transform scale-105'
                    : 'hover:scale-100'
                }`}
              >
                {/* Active Background مصغر */}
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl shadow-lg transition-all duration-300"
                       style={{
                         background: 'linear-gradient(135deg, hsl(24, 95%, 60%) 0%, hsl(28, 85%, 65%) 100%)',
                       }}>
                  </div>
                )}
                
                {/* Icon Container مصغر */}
                <div className={`relative p-2 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'text-white'
                    : 'text-gray-400 hover:text-primary'
                }`}>
                  <Icon className="w-4 h-4" />
                  
                  {/* Cart Badge مصغر */}
                  {tab.id === 'cart' && cartItemCount > 0 && (
                    <div className="absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg animate-pulse border border-white"
                         style={{
                           background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                           fontSize: '8px'
                         }}>
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </div>
                  )}
                </div>
                
                {/* Label مصغر */}
                <span className={`text-xs font-medium mt-1 arabic-text transition-all duration-300 ${
                  isActive 
                    ? 'text-white'
                    : 'text-gray-500'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Decorative line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 rounded-full opacity-30"
             style={{
               background: 'linear-gradient(90deg, hsl(24, 95%, 60%) 0%, hsl(28, 85%, 65%) 100%)',
             }}>
        </div>
      </div>
      
      {/* Bottom Safe Area */}
      <div className="h-safe-area-inset-bottom bg-white/80" />
    </div>
  );
};
