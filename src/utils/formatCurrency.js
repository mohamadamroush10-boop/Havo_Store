export function formatCurrency(amount, language) {
  const locale = language === "ar" ? "ar" : language === "tr" ? "tr-TR" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
