import "./globals.css";

export const metadata = {
  title: "ALIP STORE",
  description: "Akun game — Mobile Legends, Free Fire, Genshin Impact, dan lainnya.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
