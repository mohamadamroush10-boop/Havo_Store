import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import DarkThemeLogo from "../../img/logo-dark.png";
import LightThemeLogo from "../../img/logo-light.svg";
import { FaSearch, FaRegHeart } from "react-icons/fa";
import {
  IoChevronDown,
  IoCheckmark,
  IoLanguageOutline,
  IoMoonOutline,
  IoSearch,
  IoSunnyOutline,
} from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { useStorefrontCart } from "../../hooks/useStorefrontCart";
import { useSearchProductsQuery } from "../../store/api";
import { setLanguage, toggleTheme } from "../../store/preferencesSlice";

const LANGUAGES = [
  { code: "en", label: "English", shortLabel: "EN" },
  { code: "tr", label: "Türkçe", shortLabel: "TR" },
  { code: "ar", label: "العربية", shortLabel: "عربي" },
];

function TopHeader() {
  const { cartCount, favoriteCount } = useStorefrontCart();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.preferences.language);
  const theme = useSelector((state) => state.preferences.theme);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);
  const languageMenuRef = useRef(null);
  const languageButtonRef = useRef(null);
  const languageOptionRefs = useRef([]);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const trimmedQuery = query.trim();
  const {
    currentData: suggestions = [],
    isFetching: suggestionsLoading,
    isError: suggestionsError,
  } = useSearchProductsQuery(
    { term: debouncedQuery, limit: 5 },
    { skip: debouncedQuery.length < 2 },
  );
  const suggestionStatus =
    trimmedQuery.length < 2
      ? "idle"
      : debouncedQuery !== trimmedQuery
        ? "loading"
        : suggestionsError
          ? "error"
          : suggestionsLoading
            ? "loading"
            : "loaded";
  const showSuggestions =
    isSearchFocused && trimmedQuery.length >= 2 && suggestionStatus !== "idle";

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(trimmedQuery);
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [trimmedQuery]);

  useEffect(() => {
    function closeSearchSuggestions(event) {
      if (!searchContainerRef.current?.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }

    function closeMenusOnOutsideClick(event) {
      if (!languageMenuRef.current?.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
    }

    function closeMenusOnEscape(event) {
      if (event.key === "Escape") {
        setIsSearchFocused(false);
        if (languageMenuRef.current?.contains(document.activeElement)) {
          setIsLanguageMenuOpen(false);
          languageButtonRef.current?.focus();
        }
      }
    }

    document.addEventListener("pointerdown", closeSearchSuggestions);
    document.addEventListener("pointerdown", closeMenusOnOutsideClick);
    document.addEventListener("keydown", closeMenusOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeSearchSuggestions);
      document.removeEventListener("pointerdown", closeMenusOnOutsideClick);
      document.removeEventListener("keydown", closeMenusOnEscape);
    };
  }, []);

  useEffect(() => {
    if (isLanguageMenuOpen) {
      const selectedIndex = LANGUAGES.findIndex(
        (item) => item.code === language,
      );
      languageOptionRefs.current[selectedIndex]?.focus();
    }
  }, [isLanguageMenuOpen, language]);

  function handleLanguageOptionKeyDown(event, index) {
    let nextIndex;
    if (event.key === "ArrowDown") {
      nextIndex = (index + 1) % LANGUAGES.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = (index - 1 + LANGUAGES.length) % LANGUAGES.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = LANGUAGES.length - 1;
    }

    if (nextIndex !== undefined) {
      event.preventDefault();
      languageOptionRefs.current[nextIndex]?.focus();
    }
  }

  function selectLanguage(code) {
    dispatch(setLanguage(code));
    setIsLanguageMenuOpen(false);
    languageButtonRef.current?.focus();
  }

  function handleSearch(event) {
    event.preventDefault();
    const searchTerm = query.trim();

    if (searchTerm) {
      navigate(`/search?search=${encodeURIComponent(searchTerm)}`);
      setQuery("");
      setIsSearchFocused(false);
    }
  }

  function handleQueryChange(event) {
    setQuery(event.target.value);
  }

  function openProduct(productId) {
    navigate(`/products/${productId}`);
    setQuery("");
    setIsSearchFocused(false);
  }

  return (
    <div
      className={`relative w-full border-b border-slate-200/70 bg-slate-50 ${
        isLanguageMenuOpen ? "z-50" : "z-10"
      }`}
    >
      <div className="hidden h-8 items-center justify-center bg-slate-900 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white sm:flex">
        {t("thoughtfulFinds")} <span className="mx-2 text-lime-300">·</span>{" "}
        {t("freeShipping")}
      </div>
      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className="mx-auto grid w-full max-w-360 grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[auto_auto] items-center gap-x-1 gap-y-3 px-3 py-3 sm:grid-rows-1 sm:gap-x-5 sm:gap-y-0 sm:px-6 sm:py-4 lg:grid-cols-[minmax(150px,0.75fr)_minmax(240px,2fr)_max-content] lg:gap-x-10 lg:px-10"
      >
        <Link
          to="/"
          aria-label={t("home")}
          className="inline-flex w-fit items-center rounded-lg transition duration-200 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
        >
          <span
            className={`inline-flex items-center justify-center ${
              theme === "dark" ? "rounded-lg bg-slate-50 p-1" : ""
            }`}
          >
            <img
              src={theme === "dark" ? DarkThemeLogo : LightThemeLogo}
              alt={t("storeName")}
              className="h-9 w-auto max-w-24 object-contain sm:h-11 sm:max-w-none lg:h-13"
            />
          </span>
        </Link>

        <div
          ref={searchContainerRef}
          className="relative col-span-3 row-start-2 min-w-0 sm:col-span-1 sm:col-start-2 sm:row-start-1 lg:col-start-2"
        >
          <form
            role="search"
            onSubmit={handleSearch}
            className="flex h-10 min-w-0 items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm shadow-slate-900/5 transition duration-200 hover:border-slate-300 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-md focus-within:shadow-blue-900/5 focus-within:ring-4 focus-within:ring-blue-100 sm:h-12"
          >
            <label htmlFor="product-search" className="sr-only">
              {t("searchProducts")}
            </label>
            <input
              type="search"
              name="search"
              id="product-search"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={t("searchProducts")}
              autoComplete="off"
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:px-5 sm:text-base"
            />
            <button
              type="submit"
              aria-label={t("search")}
              className="m-1 flex h-8 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-blue-800 text-white shadow-sm shadow-blue-900/20 transition duration-200 hover:scale-[1.03] hover:shadow-md hover:shadow-blue-900/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:h-10 sm:w-11"
            >
              <FaSearch aria-hidden="true" className="text-sm" />
            </button>
          </form>

          {showSuggestions && (
            <div
              id="product-search-suggestions"
              role="group"
              aria-label={t("productSuggestions")}
              className="absolute inset-x-0 top-full z-70 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/15"
            >
              {suggestionStatus === "loading" && (
                <p role="status" className="px-3 py-3 text-sm text-slate-500">
                  {t("findingProducts")}
                </p>
              )}
              {suggestionStatus === "error" && (
                <p role="status" className="px-3 py-3 text-sm text-slate-500">
                  {t("suggestionsUnavailable")}
                </p>
              )}
              {suggestionStatus === "loaded" && suggestions.length === 0 && (
                <p className="px-3 py-3 text-sm text-slate-500">
                  {t("noMatch")}
                </p>
              )}
              {suggestionStatus === "loaded" &&
                suggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => openProduct(product.id)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-start transition hover:bg-blue-50 focus-visible:bg-blue-50 focus-visible:outline-none"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 p-1">
                      <img
                        src={product.thumbnail}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-800">
                        {product.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs capitalize text-slate-500">
                        {t(
                          `category_${product.category.replaceAll("-", "_")}`,
                          {
                            defaultValue: product.category.replaceAll("-", " "),
                          },
                        )}
                      </span>
                    </span>
                    <IoSearch
                      aria-hidden="true"
                      className="shrink-0 text-slate-400"
                    />
                  </button>
                ))}
              {suggestionStatus === "loaded" && suggestions.length > 0 && (
                <button
                  type="button"
                  onClick={handleSearch}
                  className="mt-1 flex w-full items-center justify-center rounded-lg border-t border-slate-100 px-3 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  {t("viewAllResults")} “{query.trim()}”
                </button>
              )}
            </div>
          )}
        </div>

        <div className="col-start-3 row-start-1 flex items-center justify-self-end gap-1 sm:gap-1.5 lg:gap-3">
          <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-3">
            <Link
              to="/favorites"
              aria-label={t("wishlist")}
              className="flex items-center gap-2 rounded-full p-0.5 text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:p-2 lg:px-3"
            >
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-base text-blue-700 shadow-sm shadow-blue-900/5 sm:h-10 sm:w-10 sm:text-lg">
                <FaRegHeart aria-hidden="true" />
                <span className="absolute -inset-e-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold leading-none text-white">
                  {favoriteCount}
                </span>
              </span>
              <span className="hidden text-sm font-semibold lg:inline">
                {t("wishlist")}
              </span>
            </Link>
            <Link
              to="/cart"
              aria-label={t("cart")}
              className="flex items-center gap-2 rounded-full p-0.5 text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:p-2 lg:px-3"
            >
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-700 shadow-sm shadow-blue-900/5 sm:h-10 sm:w-10 sm:text-2xl">
                <TiShoppingCart aria-hidden="true" />
                <span className="absolute -inset-e-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold leading-none text-white">
                  {cartCount}
                </span>
              </span>
              <span className="hidden text-sm font-semibold lg:inline">
                {t("cart")}
              </span>
            </Link>
          </div>
          <div
            role="group"
            aria-label={t("preferences")}
            className="flex items-center gap-1 sm:gap-1.5 lg:gap-3"
          >
            <div ref={languageMenuRef} className="relative">
              <button
                ref={languageButtonRef}
                type="button"
                aria-label={t("language")}
                aria-haspopup="menu"
                aria-expanded={isLanguageMenuOpen}
                aria-controls="language-options"
                onClick={() => setIsLanguageMenuOpen((isOpen) => !isOpen)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setIsLanguageMenuOpen(true);
                  }
                }}
                className="group flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:h-10 sm:gap-2 sm:px-3"
              >
                <IoLanguageOutline
                  aria-hidden="true"
                  className="shrink-0 text-sm text-blue-700 sm:text-base"
                />
                <span className="text-xs font-bold text-slate-800 sm:text-sm">
                  {LANGUAGES.find((item) => item.code === language)?.shortLabel}
                </span>
                <IoChevronDown
                  aria-hidden="true"
                  className={`text-xs text-slate-500 transition-transform duration-200 ${
                    isLanguageMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isLanguageMenuOpen && (
                <div
                  id="language-options"
                  role="menu"
                  aria-label={t("language")}
                  className="absolute inset-e-0 top-full z-80 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 text-slate-800 shadow-xl shadow-slate-900/20 ring-1 ring-black/5"
                >
                  <div className="px-2 pb-1 pt-0.5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {t("language")}
                    </p>
                  </div>
                  <div className="grid gap-0.5">
                    {LANGUAGES.map((item, index) => (
                      <button
                        key={item.code}
                        ref={(element) => {
                          languageOptionRefs.current[index] = element;
                        }}
                        type="button"
                        role="menuitemradio"
                        aria-checked={language === item.code}
                        onClick={() => selectLanguage(item.code)}
                        onKeyDown={(event) =>
                          handleLanguageOptionKeyDown(event, index)
                        }
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start transition focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-600 ${
                          language === item.code
                            ? "bg-blue-50 text-blue-800"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          dir={item.code === "ar" ? "rtl" : "ltr"}
                          lang={item.code}
                          className="flex size-7 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-[10px] font-bold text-slate-600 shadow-sm"
                        >
                          {item.shortLabel}
                        </span>
                        <span className="flex-1 text-xs font-semibold">
                          {item.label}
                        </span>
                        {language === item.code && (
                          <IoCheckmark
                            aria-hidden="true"
                            className="text-base text-blue-700"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              aria-pressed={theme === "dark"}
              aria-label={
                theme === "dark"
                  ? t("switchToLightMode")
                  : t("switchToDarkMode")
              }
              title={t("theme")}
              onClick={() => dispatch(toggleTheme())}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:size-10"
            >
              {theme === "dark" ? (
                <IoSunnyOutline aria-hidden="true" className="text-lg" />
              ) : (
                <IoMoonOutline aria-hidden="true" className="text-lg" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopHeader;
