export function formatPrice(n) {
  if (n == null) return "—";
  return "Rp" + Number(n).toLocaleString("id-ID");
}

export function buildWaLink(waNumber, product) {
  const finalPrice = product.promo_active && product.promo_price != null
    ? product.promo_price
    : product.price;

  const message =
    `Halo ALIP STORE, saya ingin membeli produk berikut:\n\n` +
    `Nama: ${product.title}\n` +
    `ID Produk: ${product.product_code}\n` +
    `Harga: ${formatPrice(finalPrice)}\n\n` +
    `Apakah akun ini masih tersedia?`;

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}
