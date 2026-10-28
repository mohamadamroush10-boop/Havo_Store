import { Link } from "react-router-dom";
import { A11y, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import Products from "./Products";
import { useTranslation } from "react-i18next";

function SlideProducts({ title, heading, products, categorySlug }) {
  const { t, i18n } = useTranslation();
  const translatedTitle = t(
    `category_${title.toLowerCase().replaceAll(/[\s-]+/g, "_")}`,
    {
      defaultValue: title,
    },
  );
  const translatedHeading = heading ?? t("popularProducts");
  const headingId = `products-${title.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <section
      aria-labelledby={headingId}
      className="mx-auto w-full max-w-360 px-4 py-8 sm:px-6 sm:py-10 lg:px-10"
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="relative ps-4 before:absolute before:inset-y-1 before:inset-s-0 before:w-1 before:rounded-full before:bg-blue-600">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">{translatedTitle}</p>
          <h2
            id={headingId}
            className="mt-1 font-inter text-2xl font-semibold tracking-[-0.035em] text-slate-900 sm:text-3xl"
          >
            {translatedHeading}
          </h2>
        </div>
        {categorySlug ? (
          <Link
            to={`/category/${categorySlug}`}
            className="shrink-0 text-xs font-semibold text-blue-700 transition hover:text-blue-800 sm:text-sm"
          >
            {t("browseCollection")}
          </Link>
        ) : (
          <p className="hidden text-xs font-medium uppercase tracking-[0.13em] text-slate-500 sm:block">
            {t("curatedForYou")}
          </p>
        )}
      </div>

      {products.length === 0 && (
        <p className="py-12 text-center text-slate-500">
          {t("noProductsAvailable")}
        </p>
      )}

      {products.length > 0 && (
        <Swiper
          key={i18n.language}
          modules={[A11y, Keyboard, Pagination]}
          slidesPerView={2}
          spaceBetween={16}
          speed={650}
          grabCursor
          keyboard={{ enabled: true }}
          loop={products.length > 4}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="pb-12! [&_.swiper-pagination-bullet]:bg-slate-400 [&_.swiper-pagination-bullet-active]:bg-blue-700"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="h-auto!">
              <Products product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}

export default SlideProducts;
