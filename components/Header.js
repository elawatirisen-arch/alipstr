"use client";

export default function Header({ query, onQueryChange, storeName = "ALIP STORE" }) {
  const first = storeName.slice(0, 4).toUpperCase();
  const rest = storeName.slice(4);
  return (
    <header className="site-header">
      <div className="brand">{first}<span>{rest}</span></div>
      <div className="search-wrap">
        <input
          placeholder="Cari akun atau game..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
    </header>
  );
}
