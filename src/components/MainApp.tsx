import { useState } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { HomeScreen } from './screens/HomeScreen';
import { CartScreen } from './screens/CartScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ProfileScreen } from './screens/ProfileScreen';

interface MainAppProps {
  selectedCity: string;
}

export const MainApp = ({ selectedCity }: MainAppProps) => {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState<any[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

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
      setCart(cart.filter(item => item.id !== productId));
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
        return (
          <HomeScreen 
            onAddToCart={addToCart} 
            selectedSubCategory={selectedSubCategory}
            cart={cart}
          />
        );
      case 'cart':
        return (
          <CartScreen
            cart={cart}
            onUpdateCart={updateCartItem}
            onClearCart={clearCart}
            selectedSubCategory={selectedSubCategory}
          />
        );
      case 'settings':
        return <SettingsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return (
          <HomeScreen 
            onAddToCart={addToCart} 
            selectedSubCategory={selectedSubCategory}
            cart={cart}
          />
        );
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
