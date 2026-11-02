"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProductCard from "./ProductCard";

export default function ProductGrid({ query, category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(url, sort_order)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      // urutkan foto tiap produk berdasarkan sort_order
      const withSortedImages = data.map((p) => ({
        ...p,
        product_images: [...(p.product_images || [])].sort(
          (a, b) => a.sort_order - b.sort_order
        ),
      }));
      setProducts(withSortedImages);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();

    // Sinkronisasi real-time: setiap perubahan dari admin langsung terpantul di sini
    const channel = supabase
      .channel("public-products")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, loadProducts)
      .on("postgres_changes", { event: "*", schema: "public", table: "product_images" }, loadProducts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = category === "Semua" || p.game === category;
    const q = query.trim().toLowerCase();
    const matchQ = !q || p.title.toLowerCase().includes(q) || p.game.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  if (loading) {
    return <div className="empty">Memuat produk...</div>;
  }

  if (filtered.length === 0) {
    return <div className="empty">Tidak ada akun yang cocok dengan pencarian ini.</div>;
  }

  return (
    <div className="grid">
      {filtered.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
