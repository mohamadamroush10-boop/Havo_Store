import assert from "node:assert/strict";
import test from "node:test";

const storage = new Map();
globalThis.localStorage = {
  getItem(key) {
    return storage.get(key) ?? null;
  },
  setItem(key, value) {
    storage.set(key, value);
  },
};

const requests = [];
globalThis.fetch = async (input) => {
  requests.push(typeof input === "string" ? input : input.url);
  return new Response(JSON.stringify({ id: 1, title: "Test product" }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};

const [{ store }, { storeApi }, { toggleTheme }] = await Promise.all([
  import("../src/store/store.js"),
  import("../src/store/api.js"),
  import("../src/store/preferencesSlice.js"),
]);

test("store registers RTK Query and persists preference changes", async () => {
  const product = await store
    .dispatch(storeApi.endpoints.getProduct.initiate(1))
    .unwrap();

  assert.equal(product.title, "Test product");
  assert.equal(requests.length, 1);
  assert.match(requests[0], /dummyjson\.com\/products\/1$/);
  assert.equal(
    storeApi.endpoints.getProduct.select(1)(store.getState()).status,
    "fulfilled",
  );

  store.dispatch(toggleTheme());
  assert.equal(
    JSON.parse(storage.get("storefront-preferences")).theme,
    "dark",
  );
});
