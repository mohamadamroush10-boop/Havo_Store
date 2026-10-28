import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DarkThemeLogo from "../img/logo-dark.png";

const footerLinks = [
  { label: "home", to: "/" },
  { label: "about", to: "/about" },
  { label: "accessories", to: "/accessories" },
  { label: "journal", to: "/blog" },
  { label: "contact", to: "/contact" },
];
const shoppingLinks = [
  { label: "continueShopping", to: "/" },
  { label: "wishlist", to: "/favorites" },
  { label: "cart", to: "/cart" },
];
const currentYear = new Date().getFullYear();

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="site-footer mt-16 border-t border-slate-200 text-white">
      <div className="mx-auto max-w-360 px-4 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <div className="grid gap-9 border-b border-white/10 pb-9 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1.2fr] lg:gap-12 lg:pb-12">
          <div className="max-w-sm">
            <Link
              to="/"
              aria-label={t("home")}
              className="inline-flex rounded-lg bg-[#f7f6f1] p-1.5 transition hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-200"
            >
              <img
                src={DarkThemeLogo}
                alt={t("storeName")}
                className="h-12 w-auto object-contain sm:h-13"
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/70">
              {t("footerTagline")}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-lime-200">
              {t("explore")}
            </h2>
            <nav
              aria-label={t("footerNavigation")}
              className="mt-4 grid justify-items-start gap-3"
            >
              {footerLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-sm text-white/70 transition hover:text-lime-200 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-200"
                >
                  {t(item.label)}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-lime-200">
              {t("shopping")}
            </h2>
            <nav
              aria-label={t("shopping")}
              className="mt-4 grid justify-items-start gap-3"
            >
              {shoppingLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-sm text-white/70 transition hover:text-lime-200 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-200"
                >
                  {t(item.label)}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-lime-200">
              {t("demoNote")}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">
              {t("demoApiNote")}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-6 text-xs leading-5 text-white/55 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <span>
            © {currentYear} Storefront. {t("rights")}
          </span>
          <span>{t("madeThoughtfully")}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
