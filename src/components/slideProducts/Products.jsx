import { FaHeart, FaRegHeart, FaShareAlt } from "react-icons/fa";
import { IoCartOutline, IoCheckmarkCircle, IoStar } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useStorefrontCart } from "../../hooks/useStorefrontCart";
import { shareProduct as shareProductLink } from "../../utils/shareProduct";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/formatCurrency";

function Products({ product }) {
  const { t, i18n } = useTranslation();
  const { addToCart, cartItems, toggleFavorite, isFavorite } =
    useStorefrontCart();
  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);
  const favorite = isFavorite(product.id);
  const cartItem = cartItems.find((item) => item.id === product.id);
  const isOutOfStock = product.stock <= 0;
  const isAtStockLimit =
    Number.isFinite(product.stock) && cartItem?.quantity >= product.stock;

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
    <article className="group flex h-full flex-col select-none overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_60px_-28px_rgba(27,44,37,0.28)]">
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-[#f0efe8] p-5 sm:p-6">
        <Link
          to={`/products/${product.id}`}
          aria-label={t("viewProduct", { title: product.title })}
          className="block h-full w-full"
        >
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            draggable="false"
            className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.07]"
          />
        </Link>
        {product.discountPercentage > 0 && (
          <span className="absolute start-3 top-3 rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
        {cartItem && (
          <span className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-emerald-700 shadow-sm">
            <IoCheckmarkCircle aria-hidden="true" />
            {t("inCart")} · {cartItem.quantity}
          </span>
        )}
        <div className="absolute end-2 top-2 flex gap-1">
          <button
            type="button"
            aria-label={t("likeProduct", { title: product.title })}
            aria-pressed={favorite}
            onClick={() => toggleFavorite(product)}
            className={`flex size-10 items-center justify-center rounded-full border bg-white/95 text-sm shadow-sm backdrop-blur transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
              favorite
                ? "border-rose-200 text-rose-600"
                : "border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-600"
            }`}
          >
            {favorite ? (
              <FaHeart aria-hidden="true" />
            ) : (
              <FaRegHeart aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            aria-label={t("shareProduct", { title: product.title })}
            onClick={handleShare}
            className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-sm backdrop-blur transition hover:border-blue-200 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <FaShareAlt aria-hidden="true" className="text-base" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link
          to={`/products/${product.id}`}
          className="flex flex-1 flex-col text-inherit no-underline"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-500">
            {t(`category_${product.category.replaceAll("-", "_")}`, {
              defaultValue: product.category.replaceAll("-", " "),
            })}
          </p>
          <h3 className="mt-2 line-clamp-2 min-h-12 font-inter text-base font-semibold leading-6 tracking-[-0.02em] text-slate-900">
            {product.title}
          </h3>
          <div className="mt-2 flex items-center gap-1 text-amber-500">
            <IoStar aria-hidden="true" className="text-sm" />
            <span className="text-[13px] font-medium text-slate-700">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-inter text-xl font-bold tracking-tight text-slate-900">
              {formatCurrency(discountedPrice, i18n.language)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-slate-500 line-through">
                {formatCurrency(product.price, i18n.language)}
              </span>
            )}
          </div>
        </Link>
        <button
          type="button"
          disabled={isOutOfStock || isAtStockLimit}
          onClick={() => addToCart(product)}
          aria-label={
            isOutOfStock
              ? t("isOutOfStock", { title: product.title })
              : isAtStockLimit
                ? t("atStockLimit", { title: product.title })
                : cartItem
                  ? t("addAnother", {
                      title: product.title,
                      count: cartItem.quantity,
                    })
                  : t("addProduct", { title: product.title })
          }
          className={`mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold shadow-sm transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none ${
            cartItem
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-blue-700 text-white hover:bg-blue-800"
          }`}
        >
          {isOutOfStock ? (
            t("outOfStock")
          ) : isAtStockLimit ? (
            t("stockLimit")
          ) : cartItem ? (
            <IoCheckmarkCircle aria-hidden="true" className="text-lg" />
          ) : (
            <IoCartOutline aria-hidden="true" className="text-lg" />
          )}
          {!isOutOfStock &&
            !isAtStockLimit &&
            (cartItem
              ? t("addedCount", { count: cartItem.quantity })
              : t("addToCart"))}
        </button>
      </div>
    </article>
  );
}

export default Products;
