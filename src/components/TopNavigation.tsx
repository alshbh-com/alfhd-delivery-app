import { Home, ShoppingCart, Settings, Search, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartItemCount: number;
}

export const TopNavigation = ({ activeTab, onTabChange, cartItemCount }: TopNavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const tabs = [
    { id: 'home', icon: Home, label: 'الرئيسية' },
    { id: 'search', icon: Search, label: 'البحث' },
    { id: 'cart', icon: ShoppingCart, label: 'السلة' },
    { id: 'profile', icon: User, label: 'الحساب' },
    { id: 'settings', icon: Settings, label: 'الإعدادات' },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
           style={{
             background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,247,240,0.95) 100%)',
             backdropFilter: 'blur(20px)',
             borderBottom: '1px solid rgba(251, 146, 60, 0.1)'
           }}>
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl"
                 style={{
                   background: 'linear-gradient(135deg, hsl(24, 95%, 60%) 0%, hsl(28, 85%, 65%) 100%)',
                 }}>
              <span className="text-white text-xl font-bold">F</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-800 arabic-text">تطبيق الفهد</h1>
              <p className="text-xs text-gray-500 arabic-text">كل ما تحتاجه</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all duration-300 relative ${
                    isActive
                      ? 'text-white shadow-xl scale-105'
                      : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                  }`}
                  style={{
                    background: isActive 
                      ? 'linear-gradient(135deg, hsl(24, 95%, 60%) 0%, hsl(28, 85%, 65%) 100%)'
                      : 'transparent'
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-bold arabic-text">{tab.label}</span>
                  
                  {/* Cart Badge */}
                  {tab.id === 'cart' && cartItemCount > 0 && (
                    <div className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
                         style={{
                           background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                         }}>
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-12 h-12 rounded-2xl"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-20 right-4 left-4 rounded-3xl shadow-3xl p-6"
               style={{
                 background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(254,247,240,0.98) 100%)',
                 backdropFilter: 'blur(20px)'
               }}>
            <div className="grid grid-cols-2 gap-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex flex-col items-center p-6 rounded-3xl transition-all duration-300 relative ${
                      isActive
                        ? 'text-white shadow-2xl scale-105'
                        : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                    }`}
                    style={{
                      background: isActive 
                        ? 'linear-gradient(135deg, hsl(24, 95%, 60%) 0%, hsl(28, 85%, 65%) 100%)'
                        : 'transparent'
                    }}
                  >
                    <Icon className="w-8 h-8 mb-3" />
                    <span className="text-sm font-bold arabic-text">{tab.label}</span>
                    
                    {/* Cart Badge */}
                    {tab.id === 'cart' && cartItemCount > 0 && (
                      <div className="absolute -top-2 -right-2 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg"
                           style={{
                             background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                           }}>
                        {cartItemCount > 9 ? '9+' : cartItemCount}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};