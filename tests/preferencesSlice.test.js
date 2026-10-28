import assert from "node:assert/strict";
import test from "node:test";
import preferencesReducer, {
  setLanguage,
  toggleTheme,
} from "../src/store/preferencesSlice.js";

test("language preferences accept only the supported languages", () => {
  let state = preferencesReducer(undefined, { type: "@@test/init" });
  state = preferencesReducer(state, setLanguage("ar"));
  assert.equal(state.language, "ar");

  const unchanged = preferencesReducer(state, setLanguage("fr"));
  assert.equal(unchanged.language, "ar");
});

test("theme preference toggles between light and dark", () => {
  let state = preferencesReducer(undefined, { type: "@@test/init" });
  state = preferencesReducer(state, toggleTheme());
  assert.equal(state.theme, "dark");
  state = preferencesReducer(state, toggleTheme());
  assert.equal(state.theme, "light");
});
