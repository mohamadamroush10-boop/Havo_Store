import { createSlice } from "@reduxjs/toolkit";

const PREFERENCES_STORAGE_KEY = "storefront-preferences";

function getInitialPreferences() {
  try {
    if (typeof localStorage === "undefined") {
      return { language: "tr", theme: "light" };
    }
    const saved = JSON.parse(localStorage.getItem(PREFERENCES_STORAGE_KEY) || "{}");
    return {
      language: ["en", "tr", "ar"].includes(saved.language) ? saved.language : "tr",
      theme: saved.theme === "dark" ? "dark" : "light",
    };
  } catch (error) {
    console.error("Could not read saved storefront preferences:", error);
    return { language: "tr", theme: "light" };
  }
}

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: getInitialPreferences(),
  reducers: {
    setLanguage(state, { payload }) {
      if (payload === "en" || payload === "ar" || payload === "tr") {
        state.language = payload;
      }
    },
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
  },
});

export const { setLanguage, toggleTheme } = preferencesSlice.actions;
export { PREFERENCES_STORAGE_KEY };
export default preferencesSlice.reducer;
