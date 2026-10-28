import { useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { IoArrowForward, IoSearch } from "react-icons/io5";
import Products from "../components/slideProducts/Products";
import { PageHeader, PageLayout } from "../components/layout/PageLayout";
import { useSearchProductsQuery } from "../store/api";
import { useTranslation } from "react-i18next";

function SearchResults() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query =
    searchParams.get("search")?.trim() || searchParams.get("q")?.trim() || "";
  const [filters, setFilters] = useState({
    query,
    category: "",
    maxPrice: "",
    sortBy: "relevance",
    visibleCount: 12,
  });
  const activeFilters =
    filters.query === query
      ? filters
      : { query, category: "", maxPrice: "", sortBy: "relevance", visibleCount: 12 };
  const { category, maxPrice, sortBy, visibleCount } = activeFilters;
  const {
    currentData: products = [],
    isLoading,
    isError,
  } = useSearchProductsQuery(
    { term: query, limit: 0 },
    { skip: !query },
  );
  const status = isLoading ? "loading" : isError ? "error" : "loaded";

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const price = product.price * (1 - product.discountPercentage / 100);
      return (
        (!category || product.category === category) &&
        (!maxPrice || price <= Number(maxPrice))
      );
    });

    return filtered.sort((first, second) => {
      const firstPrice =
        first.price * (1 - first.discountPercentage / 100);
      const secondPrice =
        second.price * (1 - second.discountPercentage / 100);

      switch (sortBy) {
        case "priceLowToHigh":
          return firstPrice - secondPrice;
        case "priceHighToLow":
          return secondPrice - firstPrice;
        case "topRated":
          return (second.rating ?? 0) - (first.rating ?? 0);
        default:
          return 0;
      }
    });
  }, [category, maxPrice, products, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  function updateFilters(update) {
    setFilters((current) => {
      const currentFilters =
        current.query === query
          ? current
          : {
              query,
              category: "",
              maxPrice: "",
              sortBy: "relevance",
              visibleCount: 12,
            };
      const changes =
        typeof update === "function" ? update(currentFilters) : update;

      return { ...currentFilters, ...changes, query };
    });
  }

  function clearFilters() {
    updateFilters({
      category: "",
      maxPrice: "",
      sortBy: "relevance",
      visibleCount: 12,
    });
  }

  if (!query) {
    return <Navigate to="/" replace />;
  }

  return (
    <PageLayout className="min-h-[60vh]">
      <PageHeader
        eyebrow={t("productSearch")}
        title={<>{t("resultsFor")} <span className="text-lime-200">“{query}”</span></>}
        description={t("matchingProducts")}
        icon={IoSearch}
        action={
          status === "loaded" ? (
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
              {t("productsFound", { count: filteredProducts.length })}
            </span>
          ) : null
        }
      />

      {status === "loading" && (
        <section aria-label={t("loadingSearchResults")}>
          <p role="status" className="mb-5 text-sm font-medium text-slate-600">
            {t("findingProducts")}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white p-3"
              >
                <div className="aspect-16/10 rounded-lg bg-slate-100" />
                <div className="mt-4 h-3 w-1/3 rounded bg-slate-100" />
                <div className="mt-3 h-4 w-4/5 rounded bg-slate-100" />
                <div className="mt-5 h-5 w-1/2 rounded bg-slate-100" />
                <div className="mt-4 h-10 rounded-lg bg-slate-100" />
              </div>
            ))}
          </div>
        </section>
      )}

      {status === "error" && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-5 text-sm text-red-800"
        >
          <h2 className="font-semibold">{t("searchUnavailable")}</h2>
          <p className="mt-1 text-red-700">
            {t("searchAgain")}
          </p>
        </div>
      )}

      {status === "loaded" && query && products.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm shadow-slate-900/5">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-500">
            <IoSearch aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            {t("noProducts")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            {t("noSearchMatch")}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            {t("browseProducts")}
            <IoArrowForward aria-hidden="true" className="rtl:rotate-180" />
          </Link>
        </div>
      )}

      {status === "loaded" && products.length > 0 && (
        <section aria-label={t("searchResultsFor", { query })}>
          <div
            role="group"
            aria-label={t("productFilters")}
            className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end"
          >
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              {t("filterCategory")}
              <select
                value={category}
                onChange={(event) => {
                  updateFilters({
                    category: event.target.value,
                    visibleCount: 12,
                  });
                }}
                className="h-10 min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">{t("allCategories")}</option>
                {[...new Set(products.map((product) => product.category))]
                  .sort()
                  .map((slug) => (
                    <option key={slug} value={slug}>
                      {t(`category_${slug.replaceAll("-", "_")}`, {
                        defaultValue: slug.replaceAll("-", " "),
                      })}
                    </option>
                  ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              {t("maxPrice")}
              <input
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={maxPrice}
                onChange={(event) => {
                  updateFilters({
                    maxPrice: event.target.value,
                    visibleCount: 12,
                  });
                }}
                className="h-10 min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              {t("sortBy")}
              <select
                value={sortBy}
                onChange={(event) => {
                  updateFilters({
                    sortBy: event.target.value,
                    visibleCount: 12,
                  });
                }}
                className="h-10 min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="relevance">{t("sortedByRelevance")}</option>
                <option value="priceLowToHigh">{t("priceLowToHigh")}</option>
                <option value="priceHighToLow">{t("priceHighToLow")}</option>
                <option value="topRated">{t("topRated")}</option>
              </select>
            </label>
            <button
              type="button"
              onClick={clearFilters}
              disabled={!category && !maxPrice && sortBy === "relevance"}
              className="min-h-10 rounded-lg px-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {t("clearFilters")}
            </button>
          </div>
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-semibold text-slate-800">
              {t("matchingProducts")}
            </h2>
            <span className="text-xs text-slate-500">
              {t("productsFound", { count: filteredProducts.length })}
            </span>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
              <h2 className="text-lg font-bold text-slate-900">
                {t("noFilteredProducts")}
              </h2>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 font-semibold text-blue-700 hover:text-blue-800"
              >
                {t("clearFilters")}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {visibleProducts.map((product) => (
                  <Products key={product.id} product={product} />
                ))}
              </div>
              {visibleCount < filteredProducts.length && (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      updateFilters((current) => ({
                        visibleCount: current.visibleCount + 12,
                      }))
                    }
                    className="min-h-11 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    {t("loadMore")}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </PageLayout>
  );
}

export default SearchResults;
