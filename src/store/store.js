import { configureStore } from "@reduxjs/toolkit";
import cartReducer, {
  CART_STORAGE_KEY,
  FAVORITES_STORAGE_KEY,
} from "./cartSlice.js";
import preferencesReducer, {
  PREFERENCES_STORAGE_KEY,
} from "./preferencesSlice.js";
import { storeApi } from "./api.js";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    preferences: preferencesReducer,
    [storeApi.reducerPath]: storeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(storeApi.middleware),
});

let previousCartItems = store.getState().cart.cartItems;
let previousFavoriteItems = store.getState().cart.favoriteItems;
let previousPreferencesState = store.getState().preferences;

// Persist only changed user data; the RTK Query cache and transient toast stay ephemeral.
store.subscribe(() => {
  const { cart, preferences } = store.getState();
  const cartItemsChanged = cart.cartItems !== previousCartItems;
  const favoriteItemsChanged = cart.favoriteItems !== previousFavoriteItems;
  const preferencesChanged = preferences !== previousPreferencesState;

  if (!cartItemsChanged && !favoriteItemsChanged && !preferencesChanged) return;

  previousCartItems = cart.cartItems;
  previousFavoriteItems = cart.favoriteItems;
  previousPreferencesState = preferences;

  try {
    if (cartItemsChanged) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.cartItems));
    }
    if (favoriteItemsChanged) {
      localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(cart.favoriteItems),
      );
    }
    if (preferencesChanged) {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
    }
  } catch (error) {
    console.error("Could not save storefront state to this device:", error);
  }
});
