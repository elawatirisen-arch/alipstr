"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Header from "../components/Header";
import CategoryFilter from "../components/CategoryFilter";
import ProductGrid from "../components/ProductGrid";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [categories, setCategories] = useState([]);
  const [storeName, setStoreName] = useState("ALIP STORE");

  useEffect(() => {
    supabase
      .from("categories")
      .select("name")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setCategories(data.map((c) => c.name));
      });

    supabase
      .from("store_settings")
      .select("store_name")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data?.store_name) setStoreName(data.store_name);
      });
  }, []);

  return (
    <>
      <Header query={query} onQueryChange={setQuery} storeName={storeName} />

      <div className="hero">
        <h1>Akun game</h1>
        <p>
          Mobile Legends, Free Fire, Genshin Impact, dan game lainnya. Lihat
          detail akun, lalu hubungi lewat WhatsApp.
        </p>
      </div>

      <CategoryFilter categories={categories} active={category} onChange={setCategory} />

      <main className="content">
        <ProductGrid query={query} category={category} />
      </main>

      <footer className="site-footer">© {new Date().getFullYear()} {storeName}</footer>
    </>
  );
}
