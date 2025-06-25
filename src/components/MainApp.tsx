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
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleAddToCart = (product: any, quantity: number = 1) => {
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

  const handleUpdateQuantity = (productId: string, quantity: number) => {
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

  const handleRemoveItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const handleCheckout = () => {
    // Implement checkout logic here
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onAddToCart={handleAddToCart} selectedCity={selectedCity} />;
      case 'search':
        return <HomeScreen onAddToCart={handleAddToCart} selectedCity={selectedCity} />;
      case 'cart':
        return <CartScreen cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onCheckout={handleCheckout} />;
      case 'profile':
        return <ProfileScreen />;
      case 'settings':
        return <SettingsScreen onShowAdmin={() => setShowAdmin(true)} />;
      default:
        return <HomeScreen onAddToCart={handleAddToCart} selectedCity={selectedCity} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-20">
        {renderActiveScreen()}
      </div>
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />
    </div>
  );
};
