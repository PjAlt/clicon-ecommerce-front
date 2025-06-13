
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { BackendCartItem } from '@/types/cart';
import { toast } from '@/hooks/use-toast';

export const useBackendCart = (userId?: number) => {
  const queryClient = useQueryClient();

  const { data: cartData, isLoading, error } = useQuery({
    queryKey: ['cart', userId],
    queryFn: () => userId ? apiClient.getCartItems(userId) : Promise.resolve({ data: [] }),
    enabled: !!userId,
  });

  const cartItems = (cartData as any)?.data || [];

  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      apiClient.addToCart(userId!, productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      toast({
        title: "Success",
        description: "Item added to cart",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      apiClient.updateCartItem(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (cartItemId: number) => apiClient.removeFromCart(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    },
  });

  const addToCart = (productId: number, quantity = 1) => {
    if (!userId) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }
    addToCartMutation.mutate({ productId, quantity });
  };

  const updateQuantity = (cartItemId: number, quantity: number) => {
    updateQuantityMutation.mutate({ cartItemId, quantity });
  };

  const removeFromCart = (cartItemId: number) => {
    removeFromCartMutation.mutate(cartItemId);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total: number, item: BackendCartItem) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total: number, item: BackendCartItem) => {
      return total + (item.product.currentPrice * item.quantity);
    }, 0);
  };

  return {
    items: cartItems,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
    isAddingToCart: addToCartMutation.isPending,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
  };
};
