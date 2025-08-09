
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
      
      {/* Content */}
      <div className="relative px-4 py-3">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center py-3 px-4 relative transition-all duration-500 ${
                  isActive
                    ? 'transform scale-110'
                    : 'hover:scale-105'
                }`}
              >
                {/* Active Background */}
                {isActive && (
                  <div className="absolute inset-0 rounded-3xl shadow-xl transition-all duration-500"
                       style={{
                         background: 'linear-gradient(135deg, hsl(24, 95%, 60%) 0%, hsl(28, 85%, 65%) 100%)',
                       }}>
                  </div>
                )}
                
                {/* Icon Container */}
                <div className={`relative p-3 rounded-3xl transition-all duration-500 ${
                  isActive 
                    ? 'text-white transform scale-110'
                    : 'text-gray-400 hover:text-primary hover:bg-primary/5'
                }`}>
                  <Icon className="w-6 h-6" />
                  
                  {/* Cart Badge */}
                  {tab.id === 'cart' && cartItemCount > 0 && (
                    <div className="absolute -top-1 -right-1 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-2xl animate-pulse border-2 border-white"
                         style={{
                           background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                         }}>
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </div>
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-xs font-bold mt-2 arabic-text transition-all duration-500 ${
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
