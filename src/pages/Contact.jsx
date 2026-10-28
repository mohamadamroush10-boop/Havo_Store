import { useState } from "react";
import { Link } from "react-router-dom";
import {
  IoChatbubbleEllipsesOutline,
  IoMailOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import { PageHeader, PageLayout } from "../components/layout/PageLayout";
import { useTranslation } from "react-i18next";

function Contact() {
  const { t } = useTranslation();
  const [showNotice, setShowNotice] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setShowNotice(true);
  }

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("contactEyebrow")}
        title={t("contactTitle")}
        description={t("contactDescription")}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-45px_rgba(27,44,37,0.35)] sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">{t("sendMessage")}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {t("fillForm")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                {t("yourName")}
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder={t("namePlaceholder")}
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                {t("email")}
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="you@example.com"
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-700">
              {t("subject")}
              <input
                type="text"
                name="subject"
                required
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder={t("helpPlaceholder")}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {t("message")}
              <textarea
                name="message"
                rows="5"
                required
                className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder={t("writeMessage")}
              />
            </label>

            {showNotice && (
              <p
                role="status"
                className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"
              >
                {t("contactUnavailable")}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <IoChatbubbleEllipsesOutline aria-hidden="true" />
              {t("sendMessage")}
            </button>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
            <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
              <IoMailOutline aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-bold text-slate-900">{t("emailSupport")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {t("supportNotConfigured")}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
            <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
              <IoStorefrontOutline aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-bold text-slate-900">{t("exploreStore")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {t("browseCollection")}
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex text-sm font-semibold text-blue-700 transition hover:text-blue-800"
            >
              {t("browseProducts")}
            </Link>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}

export default Contact;
