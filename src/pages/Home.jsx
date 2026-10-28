import { useMemo } from "react";
import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import SlideProducts from "../components/slideProducts/SlideProducts";
import { useGetProductsQuery } from "../store/api";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();
  const {
    data: products = [],
    isLoading,
    isError,
  } = useGetProductsQuery();
  const productsByCategory = useMemo(
    () =>
      products.reduce((groups, product) => {
        (groups[product.category] ??= []).push(product);
        return groups;
      }, {}),
    [products],
  );
  const status = isLoading ? "loading" : isError ? "error" : "loaded";

  return (
    <div>
      <HeroSlider />
      {status === "loading" && (
        <p role="status" className="py-12 text-center text-slate-500">
          {t("loadingProducts")}
        </p>
      )}
      {status === "error" && (
        <p
          role="alert"
          className="mx-auto max-w-7xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {t("loadError")}
        </p>
      )}
      {status === "loaded" &&
        Object.entries(productsByCategory)
          .sort(
            ([categoryA, productsA], [categoryB, productsB]) =>
              productsB.length - productsA.length ||
              categoryA.localeCompare(categoryB),
          )
          .slice(0, 4)
          .map(([category, products]) => (
            <SlideProducts
              key={category}
              categorySlug={category}
              title={t(
                `category_${category.replaceAll("-", "_")}`,
                { defaultValue: category.replaceAll("-", " ") },
              )}
              products={products.slice(0, 8)}
            />
          ))}
      {status === "loaded" && (
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-slate-900">
            {t("browseCategories")}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.keys(productsByCategory)
              .sort((categoryA, categoryB) =>
                categoryA.localeCompare(categoryB),
              )
              .map((category) => (
                <Link
                  key={category}
                  to={`/category/${category}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium capitalize text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                >
                  {t(`category_${category.replaceAll("-", "_")}`, {
                    defaultValue: category.replaceAll("-", " "),
                  })}
                </Link>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
