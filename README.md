# Uwais Pictures

Website rumah produksi Uwais Pictures dengan katalog film, berita, dan halaman berbahasa Indonesia serta Inggris.

**Status:** Live · [Buka website](https://uwaispictures.id/)

## Fitur

- Katalog film dan halaman detail produksi
- Berita dan informasi perusahaan
- Formulir kontak melalui endpoint PHP

## Teknologi

Eleventy 3, Nunjucks, Tailwind CSS 3, PHP / PHPMailer.

## Menjalankan secara lokal

Pasang Node.js dan npm sesuai persyaratan dependensi pada `package-lock.json`.

```sh
npm ci
npm run dev
```

Buka alamat server yang ditampilkan di terminal. Untuk build:

```sh
npm run build
```

Hasil build berada di `_site/`. Folder hasil build tidak menjadi sumber utama repository.

## Struktur

- `src/` — halaman, template, data, dan aset.
- `.eleventy.js` — konfigurasi generator website.
- `package.json` — dependensi dan perintah pengembangan.

## Formulir kontak

Endpoint `src/api/contact.php` membutuhkan server PHP. Set environment server `MAIL_USERNAME` dan `MAIL_PASSWORD` untuk SMTP. Server preview Eleventy hanya melayani halaman statis; pengiriman email perlu diuji pada server PHP.

## Catatan repository

Dependensi terpasang, cache, file `.env`, database, dan unggahan pengguna tidak disertakan. Nama merek dan aset pihak ketiga tetap mengikuti hak pemiliknya. Tidak ada lisensi penggunaan ulang yang diberikan melalui repository ini.
