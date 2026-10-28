import { Link, useParams } from "react-router-dom";
import { IoArrowBack, IoArrowForward, IoEyeOutline, IoNewspaperOutline } from "react-icons/io5";
import { PageHeader, PageLayout } from "../components/layout/PageLayout";
import { useGetPostQuery, useGetPostsQuery } from "../store/api";
import { useTranslation } from "react-i18next";

function Blog() {
  const { t } = useTranslation();
  const { postId } = useParams();
  const postQuery = useGetPostQuery(postId, { skip: !postId });
  const postsQuery = useGetPostsQuery(undefined, { skip: Boolean(postId) });
  const postNotFound = postQuery.error?.status === 404;
  const status = postId
    ? postQuery.isLoading
      ? "loading"
      : postQuery.isError
        ? postNotFound
          ? "loaded"
          : "error"
        : "loaded"
    : postsQuery.isLoading
      ? "loading"
      : postsQuery.isError
        ? "error"
        : "loaded";
  const posts = postId
    ? postQuery.currentData
      ? [postQuery.currentData]
      : []
    : (postsQuery.currentData ?? []);
  const post = posts[0];

  if (postId && status === "loaded" && post) {
    return (
      <PageLayout size="narrow">
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
        >
          <IoArrowBack aria-hidden="true" className="rtl:rotate-180" />
          {t("allArticles")}
        </Link>
        <article className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_24px_70px_-40px_rgba(27,44,37,0.3)]">
          <div className="bg-slate-900 px-6 py-10 text-white sm:px-10 sm:py-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-200">
              {t("demoArticle")}
            </p>
            <h1 className="mt-4 font-inter text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
              {t("demoDisclaimer")}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <IoEyeOutline aria-hidden="true" />
                {t("articleViews", { count: post.views ?? 0 })}
              </span>
              <span>{t("articleLikes", { count: post.reactions?.likes ?? 0 })}</span>
            </div>
          </div>
          <div className="px-6 py-8 sm:px-10 sm:py-12">
            <p className="whitespace-pre-line text-base leading-8 text-slate-700">
              {post.body}
            </p>
            {post.tags?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold capitalize text-blue-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("journalSample")}
        title={t("journalTitle")}
        description={t("journalDescription")}
        icon={IoNewspaperOutline}
      />

      {status === "loading" && (
        <p role="status" className="py-16 text-center text-slate-600">
          {t("loadingArticles")}
        </p>
      )}
      {status === "error" && (
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800"
        >
          {t("loadError")}
        </p>
      )}
      {status === "loaded" && !postId && posts.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_34px_-28px_rgba(27,44,37,0.45)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_55px_-30px_rgba(27,44,37,0.3)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                  {t("journal")}
                </span>
                <span className="text-xs text-slate-500">
                  {t("articleViews", { count: item.views ?? 0 })}
                </span>
              </div>
              <h2 className="mt-5 line-clamp-2 font-inter text-xl font-semibold leading-snug tracking-tight text-slate-900">
                {item.title}
              </h2>
              <p className="mt-3 line-clamp-4 flex-1 text-sm leading-6 text-slate-600">
                {item.body}
              </p>
              {item.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs capitalize text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <Link
                to={`/blog/${item.id}`}
                className="mt-6 inline-flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-bold text-blue-700 transition group-hover:gap-3 hover:text-blue-800"
              >
                {t("readArticle")} <IoArrowForward aria-hidden="true" className="rtl:rotate-180" />
              </Link>
            </article>
          ))}
        </div>
      )}
      {status === "loaded" && postId && !post && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
          <h2 className="text-lg font-bold text-slate-900">
            {t("articleNotFound")}
          </h2>
          <Link
            to="/blog"
            className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-800"
          >
            {t("allArticles")} <IoArrowForward aria-hidden="true" className="rtl:rotate-180" />
          </Link>
        </div>
      )}
    </PageLayout>
  );
}

export default Blog;
