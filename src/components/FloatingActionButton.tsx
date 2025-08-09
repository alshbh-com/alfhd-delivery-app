import { Plus, ShoppingCart, Search, Heart } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  onCartClick?: () => void;
  onSearchClick?: () => void;
  cartItemCount?: number;
}

export const FloatingActionButton = ({ onCartClick, onSearchClick, cartItemCount = 0 }: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Sub Actions */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 space-y-4 animate-fade-in">
          {/* Cart Button */}
          <button
            onClick={onCartClick}
            className="flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 relative"
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            }}
          >
            <ShoppingCart className="w-6 h-6 text-white" />
            {cartItemCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-white text-red-500 text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </div>
            )}
          </button>

          {/* Search Button */}
          <button
            onClick={onSearchClick}
            className="flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            }}
          >
            <Search className="w-6 h-6 text-white" />
          </button>

          {/* Favorites Button */}
          <button
            className="flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            }}
          >
            <Heart className="w-6 h-6 text-white" />
          </button>
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={toggleMenu}
        className={`flex items-center justify-center w-16 h-16 rounded-full shadow-3xl transition-all duration-500 hover:scale-110 ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
        style={{
          background: 'linear-gradient(135deg, hsl(24, 95%, 60%) 0%, hsl(28, 85%, 65%) 100%)',
        }}
      >
        <Plus className="w-8 h-8 text-white" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};