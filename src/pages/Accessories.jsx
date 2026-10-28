import { Link } from "react-router-dom";
import { IoArrowForward, IoBagHandleOutline } from "react-icons/io5";
import Products from "../components/slideProducts/Products";
import { PageHeader, PageLayout } from "../components/layout/PageLayout";
import { useGetAccessoriesQuery } from "../store/api";
import { useTranslation } from "react-i18next";

function Accessories() {
  const { t } = useTranslation();
  const {
    currentData: products = [],
    isLoading,
    isError,
  } = useGetAccessoriesQuery();
  const status = isLoading ? "loading" : isError ? "error" : "loaded";

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("madeForEveryday")}
        title={t("accessories")}
        description={t("accessoriesDescription")}
        icon={IoBagHandleOutline}
        action={
          status === "loaded" && products.length > 0 ? (
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            {t("categoryCount", { count: products.length })}
            </span>
          ) : null
        }
      />

      {status === "loading" && (
        <p role="status" className="py-16 text-center text-slate-600">
          {t("loadingAccessories")}
        </p>
      )}

      {status === "error" && (
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800"
        >
          {t("loadError")}
        </p>
      )}

      {status === "loaded" && products.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
          <h2 className="text-lg font-bold text-slate-900">
            {t("noAccessories")}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t("browseCollection")}
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-800"
          >
            {t("browseProducts")} <IoArrowForward aria-hidden="true" className="rtl:rotate-180" />
          </Link>
        </div>
      )}

      {status === "loaded" && products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Products key={product.id} product={product} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default Accessories;
