
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
    // التحقق من أن المنتج ينتمي لنفس القسم الفرعي
    if (cart.length > 0 && cart[0].sub_category_id !== product.sub_category_id) {
      // إفراغ السلة إذا كان المنتج من قسم مختلف
      setCart([{ ...product, quantity }]);
      setSelectedSubCategory(product.sub_category_id);
    } else {
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
      setSelectedSubCategory(product.sub_category_id);
    }
  };

  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      const newCart = cart.filter(item => item.id !== productId);
      setCart(newCart);
      if (newCart.length === 0) {
        setSelectedSubCategory(null);
      }
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
    setSelectedSubCategory(null);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen 
            onAddToCart={addToCart} 
            selectedCity={selectedCity}
            selectedSubCategory={selectedSubCategory}
          />
        );
      case 'cart':
        return (
          <CartScreen
            cart={cart}
            selectedCity={selectedCity}
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
            selectedCity={selectedCity}
            selectedSubCategory={selectedSubCategory}
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
