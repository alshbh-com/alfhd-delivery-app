
import { useState } from 'react';
import { TopNavigation } from './TopNavigation';
import { FloatingActionButton } from './FloatingActionButton';
import { HomeScreen } from './screens/HomeScreen';
import { CartScreen } from './screens/CartScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SearchScreen } from './screens/SearchScreen';
import { WelcomeScreen } from './WelcomeScreen';

export const SimpleApp = () => {
  const [showWelcome, setShowWelcome] = useState(false);
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

  const handleStartShopping = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onContinue={handleStartShopping} />;
  }

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
      case 'search':
        return (
          <SearchScreen 
            onAddToCart={addToCart}
            onBack={() => setActiveTab('home')}
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
    <div className="min-h-screen">
      <TopNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />
      <div className="pt-20 pb-4">
        {renderScreen()}
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        onCartClick={() => setActiveTab('cart')}
        onSearchClick={() => setActiveTab('search')}
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />
    </div>
  );
};
