import { createSlice } from "@reduxjs/toolkit";

const CART_STORAGE_KEY = "storefront-cart";
const FAVORITES_STORAGE_KEY = "storefront-favorites";

function readItems(key, isValid) {
  try {
    if (typeof localStorage === "undefined") return [];
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    if (Array.isArray(saved) && saved.every(isValid)) return saved;
    console.error(`Ignoring invalid saved store data: ${key}`);
  } catch (error) {
    console.error(`Could not read saved store data: ${key}`, error);
  }
  return [];
}

const initialState = {
  cartItems: readItems(
    CART_STORAGE_KEY,
    (item) => item?.id != null && Number.isInteger(item.quantity) && item.quantity > 0,
  ),
  favoriteItems: readItems(FAVORITES_STORAGE_KEY, (item) => item?.id != null),
  lastAddedProduct: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, { payload: { product, quantity = 1 } }) {
      if (!product || product.id == null || !Number.isInteger(quantity) || quantity < 1) {
        return;
      }
      if (Number.isFinite(product.stock) && product.stock <= 0) return;
      const existing = state.cartItems.find((item) => item.id === product.id);
      const requested = (existing?.quantity ?? 0) + quantity;
      const next = Number.isFinite(product.stock)
        ? Math.min(requested, product.stock)
        : requested;
      if (existing) existing.quantity = next;
      else state.cartItems.push({ ...product, quantity: next });
      state.lastAddedProduct = { ...product, notificationId: Date.now() };
    },
    removeFromCart(state, { payload: productId }) {
      state.cartItems = state.cartItems.filter((item) => item.id !== productId);
    },
    clearCart(state) {
      state.cartItems = [];
    },
    updateCartQuantity(state, { payload: { productId, quantity } }) {
      if (!Number.isInteger(quantity) || quantity < 1) return;
      const item = state.cartItems.find((entry) => entry.id === productId);
      if (item) {
        if (Number.isFinite(item.stock)) {
          if (item.stock < 1) return;
          item.quantity = Math.min(quantity, item.stock);
        } else {
          item.quantity = quantity;
        }
      }
    },
    toggleFavorite(state, { payload: product }) {
      if (!product || product.id == null) return;
      const exists = state.favoriteItems.some((item) => item.id === product.id);
      state.favoriteItems = exists
        ? state.favoriteItems.filter((item) => item.id !== product.id)
        : [...state.favoriteItems, product];
    },
    clearLastAddedProduct(state) {
      state.lastAddedProduct = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateCartQuantity,
  toggleFavorite,
  clearLastAddedProduct,
} = cartSlice.actions;
export { CART_STORAGE_KEY, FAVORITES_STORAGE_KEY };
export default cartSlice.reducer;
