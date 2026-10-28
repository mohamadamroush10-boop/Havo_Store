import { IoMenu } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGetCategoriesQuery } from "../../store/api";
import { useTranslation } from "react-i18next";

const NavLinks = [
  { title: "home", link: "/" },
  { title: "about", link: "/about" },
  { title: "accessories", link: "/accessories" },
  { title: "blog", link: "/blog" },
  { title: "contact", link: "/contact" },
];

function BtmHeader() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const categoriesMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoryError,
  } = useGetCategoriesQuery();

  useEffect(() => {
    function closeOnOutsideClick(event) {
      for (const menu of [categoriesMenuRef.current, mobileMenuRef.current]) {
        if (menu?.open && !menu.contains(event.target)) {
          menu.open = false;
        }
      }
    }

    function closeOnEscape(event) {
      if (event.key !== "Escape") return;

      const openMenus = [
        categoriesMenuRef.current,
        mobileMenuRef.current,
      ].filter((menu) => menu?.open);

      if (openMenus.length > 0) {
        openMenus.forEach((menu) => {
          menu.open = false;
        });
        openMenus[openMenus.length - 1]
          .querySelector("summary")
          ?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div className="w-full border-b border-slate-950 bg-[#172820]">
      <nav
        aria-label={t("mainNavigation")}
        className="mx-auto flex min-h-14 w-full max-w-360 items-center gap-3 px-3 sm:gap-5 sm:px-6 lg:px-10"
      >
        <details ref={categoriesMenuRef} className="group relative z-20 shrink-0">
          <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-full bg-lime-200 px-4 text-sm font-bold text-slate-900 transition duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden sm:px-5">
            <IoMenu aria-hidden="true" className="text-xl" />
            <span>{t("categories")}</span>
            <IoMdArrowDropdown
              aria-hidden="true"
              className="text-lg transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <div className="absolute inset-s-0 top-full mt-2 max-h-80 w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-blue-100 bg-white p-2 shadow-xl shadow-slate-900/10">
            {categoriesLoading && (
              <p role="status" className="px-3 py-2.5 text-sm text-slate-500">
                {t("loadingCategories")}
              </p>
            )}
            {categoryError && (
              <p role="status" className="px-3 py-2.5 text-sm text-red-600">
                {t("categoriesUnavailable")}
              </p>
            )}
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                onClick={() => {
                  categoriesMenuRef.current.open = false;
                }}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-800 focus-visible:bg-blue-50 focus-visible:text-blue-800 focus-visible:outline-none"
              >
                {t(`category_${category.slug.replaceAll("-", "_")}`, {
                  defaultValue: category.name,
                })}
              </Link>
            ))}
          </div>
        </details>

        <div
          className="hidden h-7 w-px shrink-0 bg-white/15 sm:block"
          aria-hidden="true"
        />

        <div className="hidden min-w-0 flex-1 items-center justify-evenly md:flex">
          {NavLinks.map((item) => {
            const isActive =
              pathname === item.link ||
              (item.link !== "/" && pathname.startsWith(`${item.link}/`));

            return (
              <Link
                key={item.link}
                to={item.link}
                aria-current={isActive ? "page" : undefined}
                className={`flex-1 rounded-xl px-2 py-2.5 text-center text-sm font-semibold transition ${
                  isActive
                    ? "bg-white/10 text-lime-200"
                      : "text-white/75 hover:bg-white/5 hover:text-white"
                }`}
              >
                {t(item.title)}
              </Link>
            );
          })}
        </div>

        <details ref={mobileMenuRef} className="group relative ms-auto md:hidden">
          <summary className="flex h-11 cursor-pointer list-none items-center gap-2 rounded-xl border border-blue-100 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm shadow-blue-900/5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 [&::-webkit-details-marker]:hidden">
            <IoMenu aria-hidden="true" className="text-xl" />
            <span>{t("menu")}</span>
            <IoMdArrowDropdown
              aria-hidden="true"
              className="text-lg transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <div className="absolute inset-e-0 top-full z-10 mt-2 flex w-56 flex-col rounded-xl border border-blue-100 bg-white p-2 shadow-xl shadow-slate-900/10">
            {NavLinks.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                onClick={() => {
                  mobileMenuRef.current.open = false;
                }}
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-800 focus-visible:bg-blue-50 focus-visible:text-blue-800 focus-visible:outline-none"
              >
                {t(item.title)}
              </Link>
            ))}
          </div>
        </details>
      </nav>
    </div>
  );
}

export default BtmHeader;
