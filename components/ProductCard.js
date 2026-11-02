"use client";

import Link from "next/link";
import { formatPrice } from "../lib/format";

export default function ProductCard({ product }) {
  const hasPromo = product.promo_active && product.promo_price != null;
  const outOfStock = product.stock === 0;
  const cover = product.product_images?.[0]?.url;

  return (
    <Link href={`/produk/${product.id}`} className="card">
      <div
        className="thumb"
        style={cover ? { backgroundImage: `url(${cover})` } : {}}
      >
        {hasPromo && <div className="badge">PROMO</div>}
        <div className={`stock-badge ${outOfStock ? "out" : ""}`}>
          {outOfStock ? "Habis" : `Stok ${product.stock}`}
        </div>
        {!cover && product.game?.[0]}
      </div>
      <div className="cbody">
        <p className="cgame">{product.game}</p>
        <p className="ctitle">{product.title}</p>
        <div className="price-row">
          <span className="now">
            {formatPrice(hasPromo ? product.promo_price : product.price)}
          </span>
          {hasPromo && <span className="was">{formatPrice(product.price)}</span>}
        </div>
      </div>
    </Link>
  );
}
