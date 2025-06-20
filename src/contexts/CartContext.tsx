
import { createContext, useContext, ReactNode } from 'react';
import { useBackendCart } from '@/hooks/useBackendCart';

interface CartContextType {
  items: any[];
  addToCart: (productId: number, quantity?: number) => void;
  removeFromCart: (cartItemId: number) => void;
  updateQuantity: (cartItemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  // Get user ID from localStorage
  const userId = (() => {
    try {
      const user = localStorage.getItem('userData');
      return user ? JSON.parse(user).nameid : undefined;
    } catch {
      return undefined;
    }
  })();

  const {
    items,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
  } = useBackendCart(userId);

  const clearCart = () => {
    // TODO:  Implementation for clearing cart
    console.log('Clear cart not implemented yet');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
