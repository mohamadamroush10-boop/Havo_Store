import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart as addToCartAction,
  clearCart as clearCartAction,
  clearLastAddedProduct as clearLastAddedProductAction,
  removeFromCart as removeFromCartAction,
  toggleFavorite as toggleFavoriteAction,
  updateCartQuantity as updateCartQuantityAction,
} from "../store/cartSlice";

// Keep cart selectors and actions together around the Redux source of truth.
export function useStorefrontCart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const favoriteItems = useSelector((state) => state.cart.favoriteItems);
  const lastAddedProduct = useSelector(
    (state) => state.cart.lastAddedProduct,
  );
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const favoriteCount = favoriteItems.length;

  const addToCart = useCallback(
    (product, quantity = 1) =>
      dispatch(addToCartAction({ product, quantity })),
    [dispatch],
  );
  const removeFromCart = useCallback(
    (productId) => dispatch(removeFromCartAction(productId)),
    [dispatch],
  );
  const clearCart = useCallback(() => dispatch(clearCartAction()), [dispatch]);
  const updateCartQuantity = useCallback(
    (productId, quantity) =>
      dispatch(updateCartQuantityAction({ productId, quantity })),
    [dispatch],
  );
  const toggleFavorite = useCallback(
    (product) => dispatch(toggleFavoriteAction(product)),
    [dispatch],
  );
  const isFavorite = useCallback(
    (productId) => favoriteItems.some((item) => item.id === productId),
    [favoriteItems],
  );
  const clearLastAddedProduct = useCallback(
    () => dispatch(clearLastAddedProductAction()),
    [dispatch],
  );

  return useMemo(
    () => ({
      cartItems,
      cartCount,
      addToCart,
      removeFromCart,
      clearCart,
      updateCartQuantity,
      favoriteItems,
      favoriteCount,
      toggleFavorite,
      isFavorite,
      lastAddedProduct,
      clearLastAddedProduct,
    }),
    [
      cartItems,
      cartCount,
      addToCart,
      removeFromCart,
      clearCart,
      updateCartQuantity,
      favoriteItems,
      favoriteCount,
      toggleFavorite,
      isFavorite,
      lastAddedProduct,
      clearLastAddedProduct,
    ],
  );
}
