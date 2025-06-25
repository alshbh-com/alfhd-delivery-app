
import { useState } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { HomeScreen } from './screens/HomeScreen';
import { CartScreen } from './screens/CartScreen';
import { SettingsScreen } from './screens/SettingsScreen';

interface MainAppProps {
  selectedCity: string;
}

export const MainApp = ({ selectedCity }: MainAppProps) => {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== productId));
    } else {
      setCart(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onAddToCart={addToCart} />;
      case 'cart':
        return (
          <CartScreen
            cart={cart}
            selectedCity={selectedCity}
            onUpdateCart={updateCartItem}
            onClearCart={clearCart}
          />
        );
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen onAddToCart={addToCart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-20">
        {renderScreen()}
      </div>
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />
    </div>
  );
};
