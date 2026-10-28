function PageLayout({ children, className = "", size = "wide" }) {
  const widthClass =
    size === "narrow" ? "max-w-4xl" : "max-w-[1440px]";

  return (
    <main
      className={`mx-auto w-full ${widthClass} px-4 py-8 sm:px-6 sm:py-12 lg:px-10 ${className}`}
    >
      {children}
    </main>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
  children,
  className = "",
}) {
  return (
    <header
      className={`relative isolate mb-9 overflow-hidden rounded-4xl bg-slate-900 p-6 text-white sm:p-10 ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute -inset-e-20 -top-32 -z-10 size-96 rounded-full border border-white/10"
      />
      <div
        aria-hidden="true"
        className="absolute -inset-e-4 -top-16 -z-10 size-64 rounded-full border border-white/10"
      />
      <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="min-w-0 max-w-3xl">
          {Icon && (
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-lime-200 text-xl text-slate-900">
              <Icon aria-hidden="true" />
            </span>
          )}
          {eyebrow && (
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-lime-200">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 font-inter text-4xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              {description}
            </p>
          )}
          {children}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}

export { PageHeader, PageLayout };
