"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { formatPrice } from "../../../lib/format";
import BuyButtons from "../../../components/BuyButtons";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProduct() {
    const { data } = await supabase
      .from("products")
      .select("*, product_images(url, sort_order)")
      .eq("id", id)
      .single();
    if (data) {
      data.product_images = [...(data.product_images || [])].sort(
        (a, b) => a.sort_order - b.sort_order
      );
    }
    setProduct(data || null);
    setLoading(false);
  }

  useEffect(() => {
    loadProduct();

    const channel = supabase
      .channel(`product-${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products", filter: `id=eq.${id}` },
        loadProduct
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [id]);

  if (loading) return <div className="empty">Memuat...</div>;
  if (!product) {
    return (
      <div className="empty">
        Produk tidak ditemukan atau sudah dihapus.
        <div style={{ marginTop: 12 }}>
          <a onClick={() => router.push("/")} style={{ color: "var(--blue-700)", cursor: "pointer" }}>
            ← Kembali ke beranda
          </a>
        </div>
      </div>
    );
  }

  const hasPromo = product.promo_active && product.promo_price != null;
  const cover = product.product_images?.[0]?.url;

  return (
    <div className="detail-wrap">
      <div
        className="detail-thumb"
        style={cover ? { backgroundImage: `url(${cover})` } : {}}
      />
      <p className="cgame">{product.game} · ID {product.product_code}</p>
      <h1>{product.title}</h1>
      <p className="desc">{product.description}</p>
      <div className="price-big">
        {formatPrice(hasPromo ? product.promo_price : product.price)}
        {hasPromo && <span className="was-big">{formatPrice(product.price)}</span>}
      </div>
      <p style={{ color: "var(--ink-soft)", fontSize: ".85rem", marginTop: 4 }}>
        {product.stock === 0 ? "Stok habis saat ini" : `Stok tersedia: ${product.stock}`}
      </p>
      <BuyButtons product={product} />
    </div>
  );
}
