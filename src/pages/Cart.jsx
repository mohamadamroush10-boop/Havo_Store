import { Link } from "react-router-dom";
import {
  IoArrowForward,
  IoBagHandleOutline,
  IoShieldCheckmarkOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { useStorefrontCart } from "../hooks/useStorefrontCart";
import { PageHeader, PageLayout } from "../components/layout/PageLayout";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils/formatCurrency";

function Cart() {
  const { t, i18n } = useTranslation();
  const { cartItems, cartCount, removeFromCart, updateCartQuantity, clearCart } =
    useStorefrontCart();
  const total = cartItems.reduce((sum, item) => {
    const price = item.price * (1 - item.discountPercentage / 100);
    return sum + price * item.quantity;
  }, 0);

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("shopping")}
        title={t("shoppingCart")}
        description={t("reviewCart")}
        icon={IoBagHandleOutline}
        action={
          cartItems.length > 0 ? (
            <button
            type="button"
            onClick={clearCart}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-red-300/50 hover:bg-red-500/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t("clearCart")}
          </button>
          ) : null
        }
      />

      {cartItems.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-50 to-blue-50/70 px-6 py-16 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-white text-3xl text-blue-700 shadow-sm">
            <IoBagHandleOutline aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-xl font-bold text-slate-900">
            {t("cartWaiting")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            {t("cartEmpty")}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            {t("continueShopping")}
            <IoArrowForward aria-hidden="true" className="rtl:rotate-180" />
          </Link>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <section aria-label={t("cartItems")}>
            <div className="mb-3 hidden grid-cols-[5rem_minmax(0,1fr)_7rem_7rem_2.5rem] gap-4 px-5 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
              <span className="col-span-2">{t("product")}</span>
              <span className="text-center">{t("quantity")}</span>
              <span className="text-end">{t("subtotal")}</span>
              <span />
            </div>
            <ul className="divide-y divide-slate-100 rounded-3xl border border-slate-200/80 bg-white px-4 shadow-[0_20px_60px_-45px_rgba(27,44,37,0.35)] sm:px-5">
              {cartItems.map((item) => {
                const price = item.price * (1 - item.discountPercentage / 100);
                const itemTotal = price * item.quantity;

                return (
                  <li
                    key={item.id}
                    className="grid grid-cols-[4.5rem_minmax(0,1fr)_2.5rem] items-center gap-3 py-4 sm:grid-cols-[5rem_minmax(0,1fr)_7rem_7rem_2.5rem] sm:gap-4 sm:py-5"
                  >
                    <Link
                      to={`/products/${item.id}`}
                      className="flex size-18 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-2 transition hover:bg-blue-50 sm:size-20"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        draggable="false"
                        className="h-full w-full object-contain"
                      />
                    </Link>
                    <div className="min-w-0">
                      <Link
                        to={`/products/${item.id}`}
                        className="line-clamp-2 text-sm font-semibold text-slate-900 transition hover:text-blue-700 sm:text-base"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-1 text-xs capitalize text-slate-500 sm:text-sm">
                        {t(`category_${item.category.replaceAll("-", "_")}`, {
                          defaultValue: item.category.replaceAll("-", " "),
                        })}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 sm:hidden">
                        {formatCurrency(price, i18n.language)} {t("each")}
                      </p>
                    </div>
                    <div className="col-start-2 col-span-2 flex items-center justify-between sm:contents">
                      <div
                        role="group"
                        aria-label={t("quantityFor", { title: item.title })}
                        className="inline-flex h-10 items-center overflow-hidden rounded-lg border border-slate-200 bg-white"
                      >
                        <button
                          type="button"
                          aria-label={t("decreaseProduct", { title: item.title })}
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity - 1)
                          }
                          className="flex size-9 items-center justify-center text-lg font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-300"
                        >
                          −
                        </button>
                        <span
                          aria-live="polite"
                          className="min-w-8 text-center text-sm font-semibold text-slate-900"
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={t("increaseProduct", { title: item.title })}
                          disabled={
                            Number.isFinite(item.stock) &&
                            item.quantity >= item.stock
                          }
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity + 1)
                          }
                          className="flex size-9 items-center justify-center text-lg font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-300"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-end text-sm font-bold text-slate-900">
                        {formatCurrency(itemTotal, i18n.language)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={t("removeProduct", { title: item.title })}
                      title={t("remove")}
                      className="col-start-3 row-start-1 flex size-10 items-center justify-center justify-self-end rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:col-start-5"
                    >
                      <IoTrashOutline aria-hidden="true" className="text-lg" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-45px_rgba(27,44,37,0.35)] sm:p-6 lg:sticky lg:top-44">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">{t("orderOverview")}</p>
            <h2 className="mt-2 font-inter text-xl font-semibold tracking-tight text-slate-900">{t("cartSummary")}</h2>
            <div className="mt-5 flex justify-between text-sm text-slate-600">
              <span>{t("items")} ({cartCount})</span>
              <span>{formatCurrency(total, i18n.language)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="font-semibold text-slate-900">{t("total")}</span>
              <span className="text-xl font-bold text-slate-900">{formatCurrency(total, i18n.language)}</span>
            </div>
            <button
              type="button"
              disabled
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white opacity-60"
            >
              {t("checkoutUnavailable")}
              <IoArrowForward aria-hidden="true" className="rtl:rotate-180" />
            </button>
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
              <IoShieldCheckmarkOutline
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-base text-emerald-600"
              />
              <p>{t("savedOnDevice")}</p>
            </div>
            <Link
              to="/"
              className="mt-4 inline-flex w-full items-center justify-center text-sm font-semibold text-blue-700 hover:text-blue-800"
            >
              {t("continueShopping")}
            </Link>
          </aside>
        </div>
      )}
    </PageLayout>
  );
}

export default Cart;
