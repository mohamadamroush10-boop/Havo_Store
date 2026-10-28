import { Link } from "react-router-dom";
import {
  IoArrowForward,
  IoBagHandleOutline,
  IoHeartOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { PageHeader, PageLayout } from "../components/layout/PageLayout";
import { useTranslation } from "react-i18next";

const values = [
  {
    icon: IoBagHandleOutline,
    title: "thoughtfulSelection",
    description: "aboutSelectionDescription",
  },
  {
    icon: IoHeartOutline,
    title: "personalShopping",
    description: "aboutPersonalDescription",
  },
  {
    icon: IoShieldCheckmarkOutline,
    title: "simplerExperience",
    description: "aboutSimpleDescription",
  },
];

function About() {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("aboutUs")}
        title={t("aboutTitle")}
        description={t("aboutDescription")}
        className="px-6 py-14 sm:px-12 sm:py-20 lg:px-16"
      >
          <Link
            to="/"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-lime-200 px-6 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t("exploreProducts")}
            <IoArrowForward aria-hidden="true" className="rtl:rotate-180" />
          </Link>
      </PageHeader>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            {t("experience")}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {t("simpleShopping")}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            {t("simpleDescription")}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          {values.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/5 sm:p-7"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                <Icon aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900">
                {t(title)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                {t(description)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50 p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {t("readyToFind")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            {t("collectionInvite")}
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          {t("shopNow")}
          <IoArrowForward aria-hidden="true" className="rtl:rotate-180" />
        </Link>
      </section>
    </PageLayout>
  );
}

export default About;
