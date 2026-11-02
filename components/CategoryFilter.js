"use client";

export default function CategoryFilter({ categories, active, onChange }) {
  const all = ["Semua", ...categories];
  return (
    <div className="cats">
      {all.map((c) => (
        <button
          key={c}
          className={c === active ? "active" : ""}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
