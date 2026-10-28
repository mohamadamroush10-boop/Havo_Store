import assert from "node:assert/strict";
import test from "node:test";
import cartReducer, {
  addToCart,
  removeFromCart,
  toggleFavorite,
  updateCartQuantity,
} from "../src/store/cartSlice.js";

const product = { id: 7, title: "Test item", price: 12, stock: 3 };

test("cart quantities stay positive and do not exceed stock", () => {
  let state = cartReducer(undefined, addToCart({ product, quantity: 2 }));
  state = cartReducer(state, addToCart({ product, quantity: 5 }));
  assert.equal(state.cartItems[0].quantity, 3);

  const unchanged = cartReducer(
    state,
    updateCartQuantity({ productId: product.id, quantity: 0 }),
  );
  assert.equal(unchanged.cartItems[0].quantity, 3);

  state = cartReducer(
    state,
    updateCartQuantity({ productId: product.id, quantity: 2 }),
  );
  assert.equal(state.cartItems[0].quantity, 2);
});

test("products without stock cannot be added and cart items can be removed", () => {
  const unavailable = { ...product, id: 8, stock: 0 };
  let state = cartReducer(
    undefined,
    addToCart({ product: unavailable, quantity: 1 }),
  );
  assert.equal(state.cartItems.length, 0);

  state = cartReducer(state, addToCart({ product, quantity: 1 }));
  state = cartReducer(state, removeFromCart(product.id));
  assert.equal(state.cartItems.length, 0);
});

test("favorites can be added and toggled off", () => {
  let state = cartReducer(undefined, toggleFavorite(product));
  assert.equal(state.favoriteItems.length, 1);
  state = cartReducer(state, toggleFavorite(product));
  assert.equal(state.favoriteItems.length, 0);
});
