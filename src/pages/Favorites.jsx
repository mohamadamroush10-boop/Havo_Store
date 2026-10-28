import { Link } from "react-router-dom";
import { IoArrowForward, IoHeart, IoSparklesOutline } from "react-icons/io5";
import { useStorefrontCart } from "../hooks/useStorefrontCart";
import Products from "../components/slideProducts/Products";
import { PageHeader, PageLayout } from "../components/layout/PageLayout";
import { useTranslation } from "react-i18next";

function Favorites() {
  const { t } = useTranslation();
  const { favoriteItems } = useStorefrontCart();

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("personalCollection")}
        title={t("favoritesTitle")}
        description={t("savedProducts")}
        icon={IoHeart}
        action={
          favoriteItems.length > 0 ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            <IoHeart aria-hidden="true" />
            {t("favoriteCountLabel", { count: favoriteItems.length })}
            </span>
          ) : null
        }
      />

      {favoriteItems.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-50 to-rose-50/60 px-6 py-16 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-white text-3xl text-rose-500 shadow-sm">
            <IoSparklesOutline aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-xl font-bold text-slate-900">
            {t("startCollection")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            {t("tapHeart")}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            {t("discoverProducts")}
            <IoArrowForward aria-hidden="true" className="rtl:rotate-180" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteItems.map((product) => (
            <Products key={product.id} product={product} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default Favorites;
