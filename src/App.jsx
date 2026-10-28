import { lazy, Suspense, useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { IoArrowForward, IoCheckmarkCircle, IoClose } from "react-icons/io5";
import { useStorefrontCart } from "./hooks/useStorefrontCart";
import BtmHeader from "./components/header/BtmHeader";
import TopHeader from "./components/header/TopHeader";
import PageTransition from "./components/PageTransition";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { PageLayout } from "./components/layout/PageLayout";

const Accessories = lazy(() => import("./pages/Accessories"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const Cart = lazy(() => import("./pages/Cart"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const Contact = lazy(() => import("./pages/Contact"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Home = lazy(() => import("./pages/Home"));
const ProductsDetails = lazy(() => import("./pages/ProductsDetails"));
const SearchResults = lazy(() => import("./pages/SearchResults"));

function NotFound() {
  const { t } = useTranslation();

  return (
    <PageLayout
      className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center"
      size="narrow"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
        {t("pageNotFound")}
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {t("notFoundTitle")}
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
        {t("pageMoved")}
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        {t("returnHome")}
      </Link>
    </PageLayout>
  );
}

function Storefront() {
  const { lastAddedProduct, clearLastAddedProduct } = useStorefrontCart();
  const location = useLocation();
  const language = useSelector((state) => state.preferences.language);
  const theme = useSelector((state) => state.preferences.theme);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const direction = language === "ar" ? "rtl" : "ltr";
    // Keep browser-native controls and document-level UI aligned with the saved language.
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    i18n.changeLanguage(language);
  }, [i18n, language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    if (!lastAddedProduct) return undefined;

    const timeoutId = window.setTimeout(clearLastAddedProduct, 4000);
    return () => window.clearTimeout(timeoutId);
  }, [lastAddedProduct, clearLastAddedProduct]);

  return (
    <>
      <ScrollToTop />
      <header className="sticky top-0 z-50 bg-white">
        <TopHeader />
        <BtmHeader />
      </header>
      <PageTransition key={location.pathname}>
        <Suspense
          fallback={
            <p role="status" className="py-16 text-center text-slate-600">
              {t("loading")}
            </p>
          }
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:postId" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products/:id" element={<ProductsDetails />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
      <Footer />
      {lastAddedProduct && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-3 bottom-4 z-60 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/20 sm:inset-x-auto sm:inset-e-6 sm:bottom-6 sm:w-100 sm:p-4"
        >
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-slate-50 p-1.5">
            <img
              src={lastAddedProduct.thumbnail}
              alt=""
              className="h-full w-full object-contain"
            />
            <span className="absolute -inset-e-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white">
              <IoCheckmarkCircle aria-hidden="true" className="text-base" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              {t("addedToCart")}
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
              {lastAddedProduct.title}
            </p>
            <Link
              to="/cart"
              onClick={clearLastAddedProduct}
              className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
            >
              {t("viewCart")}
              <IoArrowForward aria-hidden="true" className="rtl:rotate-180" />
            </Link>
          </div>
          <button
            type="button"
            aria-label={t("dismiss")}
            onClick={clearLastAddedProduct}
            className="flex size-8 shrink-0 self-start items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <IoClose aria-hidden="true" className="text-lg" />
          </button>
        </div>
      )}
    </>
  );
}

export default Storefront;
