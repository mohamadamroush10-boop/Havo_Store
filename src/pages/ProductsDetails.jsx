import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShareAlt } from "react-icons/fa";
import { IoArrowBack, IoCartOutline, IoStar } from "react-icons/io5";
import SlideProducts from "../components/slideProducts/SlideProducts";
import { useStorefrontCart } from "../hooks/useStorefrontCart";
import { shareProduct as shareProductLink } from "../utils/shareProduct";
import { PageLayout } from "../components/layout/PageLayout";
import {
  useGetProductQuery,
  useGetProductsByCategoryQuery,
} from "../store/api";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils/formatCurrency";

function ProductsDetails() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const { addToCart, cartItems, toggleFavorite, isFavorite } =
    useStorefrontCart();
  const {
    currentData: product,
    isLoading,
    isError,
  } = useGetProductQuery(id);
  const [selectedImage, setSelectedImage] = useState(null);
  const {
    currentData: categoryProducts = [],
    isLoading: relatedLoading,
    isError: relatedError,
  } = useGetProductsByCategoryQuery(
    { slug: product?.category ?? "", limit: 8 },
    { skip: !product?.category },
  );
  const relatedProducts = categoryProducts.filter(
    (relatedProduct) => relatedProduct.id !== product?.id,
  );
  const relatedStatus = !product?.category
    ? "idle"
    : relatedLoading
      ? "loading"
      : relatedError
        ? "error"
        : "loaded";

  if (isLoading) {
    return (
      <p role="status" className="py-16 text-center text-slate-600">
        {t("productDetails")}
      </p>
    );
  }

  if (isError || !product) {
    return (
      <PageLayout className="py-12">
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {t("productUnavailable")}
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          <IoArrowBack aria-hidden="true" className="rtl:rotate-180" />
          {t("backToProducts")}
        </Link>
      </PageLayout>
    );
  }

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);
  const favorite = isFavorite(product.id);
  const cartItem = cartItems.find((item) => item.id === product.id);
  const isAtStockLimit =
    Number.isFinite(product.stock) && cartItem?.quantity >= product.stock;
  const productImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.thumbnail
        ? [product.thumbnail]
        : [];
  const displayedImage =
    selectedImage?.productId === product.id
      ? selectedImage.src
      : productImages[0] ?? "";

  async function handleShare() {
    try {
      await shareProductLink(product, {
        copiedMessage: t("linkCopied"),
        copyPrompt: t("copyProductLink"),
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Failed to share product:", error);
      }
    }
  }

  return (
    <PageLayout>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
      >
        <IoArrowBack aria-hidden="true" className="rtl:rotate-180" />
        {t("backToProducts")}
      </Link>

      <article className="grid overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_28px_90px_-55px_rgba(27,44,37,0.4)] md:grid-cols-[1.05fr_0.95fr]">
        <div className="bg-[#efeee7] p-5 sm:p-8 lg:p-10">
          <div className="flex min-h-80 items-center justify-center sm:min-h-[34rem]">
            {displayedImage ? (
              <img
                src={displayedImage}
                alt={product.title}
                draggable="false"
                className="max-h-[34rem] w-full select-none object-contain drop-shadow-[0_20px_20px_rgba(27,44,37,0.1)]"
              />
            ) : (
              <p className="text-sm text-slate-500">
                {t("noProductImage")}
              </p>
            )}
          </div>
          {productImages.length > 1 && (
            <div
              role="group"
              aria-label={t("productImages")}
              className="mt-4 flex flex-wrap justify-center gap-3"
            >
              {productImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  aria-label={t("productImageNumber", { count: index + 1 })}
                  aria-pressed={displayedImage === image}
                  onClick={() =>
                    setSelectedImage({ productId: product.id, src: image })
                  }
                  className={`flex size-16 items-center justify-center overflow-hidden rounded-lg border bg-white p-1 transition sm:size-20 ${
                    displayedImage === image
                      ? "border-blue-700 ring-2 ring-blue-100"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <img
                    src={image}
                    alt=""
                    draggable="false"
                    className="h-full w-full select-none object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            {t(`category_${product.category.replaceAll("-", "_")}`, {
              defaultValue: product.category.replaceAll("-", " "),
            })}
          </p>
          <h1 className="mt-3 font-inter text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-4xl">
            {product.title}
          </h1>
          {product.brand && (
            <p className="mt-2 text-sm text-slate-500">{t("by")} {product.brand}</p>
          )}
          <div className="mt-4 flex items-center gap-1.5 text-amber-500">
            <IoStar aria-hidden="true" />
            <span className="text-sm font-medium text-slate-700">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-600">
            {product.description}
          </p>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="font-inter text-3xl font-semibold tracking-tight text-slate-900">
              {formatCurrency(discountedPrice, i18n.language)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-base text-slate-500 line-through">
                  {formatCurrency(product.price, i18n.language)}
                </span>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  {t("discountPercentage", {
                    count: Math.round(product.discountPercentage),
                  })}
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm text-slate-600">
            {product.stock > 0
              ? t("stockCount", { count: product.stock })
              : t("currentlyOutOfStock")}
          </p>
          <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2 sm:gap-3">
            <button
              type="button"
              disabled={product.stock <= 0 || isAtStockLimit}
              onClick={() => addToCart(product)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-3 py-3 text-sm font-semibold text-white shadow-md shadow-blue-700/20 transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:px-5"
            >
              <IoCartOutline aria-hidden="true" className="text-lg" />
              {product.stock <= 0
                ? t("outOfStock")
                : isAtStockLimit
                  ? t("stockLimit")
                  : t("addToCart")}
            </button>
            <button
              type="button"
              aria-label={t("likeProduct", { title: product.title })}
              aria-pressed={favorite}
              title={favorite ? t("removeFromWishlist") : t("addToWishlist")}
              onClick={() => toggleFavorite(product)}
              className={`inline-flex size-12 items-center justify-center rounded-xl border bg-white shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                favorite
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-slate-200 text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              }`}
            >
              {favorite ? (
                <FaHeart aria-hidden="true" className="text-lg" />
              ) : (
                <FaRegHeart aria-hidden="true" className="text-lg" />
              )}
            </button>
            <button
              type="button"
              aria-label={t("shareProduct", { title: product.title })}
              title={t("share")}
              onClick={handleShare}
              className="inline-flex size-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <FaShareAlt aria-hidden="true" className="text-lg" />
            </button>
          </div>
        </div>
      </article>

      {relatedStatus === "loading" && (
        <p role="status" className="py-12 text-center text-slate-500">
          {t("loadingRelated")}
        </p>
      )}
      {relatedStatus === "error" && (
        <p
          role="alert"
          className="mt-8 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {t("relatedError")}
        </p>
      )}
      {relatedStatus === "loaded" && relatedProducts.length > 0 && (
        <SlideProducts
          title={t("youMayLike")}
          heading={t("moreFromCategory")}
          products={relatedProducts}
        />
      )}
    </PageLayout>
  );
}

export default ProductsDetails;
