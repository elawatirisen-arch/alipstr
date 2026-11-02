# ALIP STORE — Website User

## 1. Setup Supabase
1. Buat akun & project baru di https://supabase.com.
2. Buka **SQL Editor** di dashboard Supabase, tempel isi file `supabase/schema.sql`, lalu jalankan (Run). Ini membuat semua tabel, keamanan (RLS), dan bucket penyimpanan foto.
3. Buka **Database > Replication**, aktifkan **Realtime** untuk tabel `products` dan `product_images` (supaya perubahan dari admin langsung muncul di website user).
4. Buka **Project Settings > API**, salin `Project URL` dan `anon public key`.

## 2. Jalankan di komputer
```bash
cp .env.local.example .env.local
# buka .env.local, isi dengan URL & anon key dari langkah 1.4

npm install
npm run dev
```
Buka `http://localhost:3000`.

## 3. Deploy online (Vercel)
1. Push folder ini ke repository GitHub.
2. Buka https://vercel.com, pilih **New Project**, hubungkan ke repo tadi.
3. Saat setup, isi **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Klik **Deploy**. Website akan online di `nama-project.vercel.app`.

## Catatan
- Website ini hanya **membaca** data (produk, kategori, pengaturan toko) — tidak bisa menambah/mengubah apa pun, sesuai keamanan (RLS) yang sudah diatur.
- Semua penambahan/pengeditan produk dilakukan lewat **website admin** (dikirim menyusul), yang memakai database Supabase yang sama persis — jadi begitu admin simpan perubahan, otomatis muncul di sini tanpa perlu deploy ulang.
