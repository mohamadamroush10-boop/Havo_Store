export async function shareProduct(product, { copiedMessage, copyPrompt }) {
  const url = new URL(`/products/${product.id}`, window.location.origin).href;
  const shareData = { title: product.title, url };

  if (navigator.share) {
    await navigator.share(shareData);
    return;
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      window.alert(copiedMessage);
      return;
    } catch (error) {
      console.error("Could not copy product link:", error);
    }
  }

  window.prompt(copyPrompt, url);
}
