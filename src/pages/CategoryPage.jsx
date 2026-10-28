import { Link, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import Products from "../components/slideProducts/Products";
import { PageHeader, PageLayout } from "../components/layout/PageLayout";
import { useGetProductsByCategoryQuery } from "../store/api";
import { useTranslation } from "react-i18next";

function CategoryPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const {
    currentData: products = [],
    isLoading,
    isError,
  } = useGetProductsByCategoryQuery(slug);
  const status = isLoading ? "loading" : isError ? "error" : "loaded";

  const categoryName = t(`category_${slug.replaceAll("-", "_")}`, {
    defaultValue: slug.replaceAll("-", " "),
  });

  return (
    <PageLayout>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
      >
        <IoArrowBack aria-hidden="true" className="rtl:rotate-180" />
        {t("backToAllProducts")}
      </Link>

      <PageHeader
        eyebrow={t("browseCollection")}
        title={categoryName}
        description={
          status === "loaded" ? (
            t("categoryCount", { count: products.length })
          ) : null
        }
      />

      {status === "loading" && (
        <p role="status" className="py-16 text-center text-slate-600">
          {t("loadingCategory")}
        </p>
      )}

      {status === "error" && (
        <div
          role="alert"
          className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          {t("loadError")}
        </div>
      )}

      {status === "loaded" && products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            {t("noCategoryProducts")}
          </h2>
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

export default CategoryPage;
