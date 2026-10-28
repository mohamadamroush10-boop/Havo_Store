import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollPageToTop() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}

function ScrollToTop() {
  const { hash, key } = useLocation();

  useEffect(() => {
    if (hash) return;

    scrollPageToTop();
  }, [hash, key]);

  useEffect(() => {
    function scrollToTopForCurrentPageLink(event) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      if (!(event.target instanceof Element)) return;

      const link = event.target.closest("a[href]");
      if (
        !link ||
        (link.target && link.target !== "_self") ||
        link.hasAttribute("download")
      ) {
        return;
      }

      const destination = new URL(link.href, window.location.href);
      if (
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search &&
        !destination.hash
      ) {
        scrollPageToTop();
      }
    }

    document.addEventListener("click", scrollToTopForCurrentPageLink);
    return () =>
      document.removeEventListener("click", scrollToTopForCurrentPageLink);
  }, []);

  return null;
}

export default ScrollToTop;
