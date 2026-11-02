"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { buildWaLink } from "../lib/format";

export default function BuyButtons({ product }) {
  const [wa, setWa] = useState({ wa_number_1: "6285840840520", wa_number_2: "6285764594213" });

  useEffect(() => {
    supabase
      .from("store_settings")
      .select("wa_number_1, wa_number_2")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) setWa(data);
      });
  }, []);

  if (product.stock === 0) {
    return (
      <div className="buy-group">
        <span className="buy-btn disabled">Stok Habis</span>
      </div>
    );
  }

  return (
    <div className="buy-group">
      <a className="buy-btn" target="_blank" rel="noopener noreferrer" href={buildWaLink(wa.wa_number_1, product)}>
        BUY via WhatsApp 1
      </a>
      <a className="buy-btn alt" target="_blank" rel="noopener noreferrer" href={buildWaLink(wa.wa_number_2, product)}>
        BUY via WhatsApp 2
      </a>
    </div>
  );
}
