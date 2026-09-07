# CV Builder

CV Builder adalah aplikasi web client-side untuk membuat CV profesional, ramah ATS, dan siap dicetak atau disimpan sebagai PDF.

## Fitur

- Editor CV dengan section yang terstruktur.
- Template Modern, Minimal, dan Classic.
- Preview ukuran A4.
- Print dan Save as PDF melalui browser.
- Import dan export JSON.
- Penyimpanan lokal tanpa akun.
- Prompt AI eksternal dengan pilihan bahasa Indonesia atau Inggris.
- Responsive untuk desktop dan mobile.

## Privasi

Data CV disimpan di browser pengguna menggunakan `localStorage`. Aplikasi tidak menggunakan database atau mengirim data CV ke server secara otomatis. Alur AI bersifat manual: pengguna menyalin prompt ke layanan AI eksternal dan menempelkan JSON hasilnya kembali ke aplikasi.

## Menjalankan Lokal

```powershell
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Build Produksi

```powershell
npm run build
```

Build menghasilkan folder `out` untuk static hosting seperti Cloudflare Pages atau GitHub Pages.

## Deployment Cloudflare Pages

- Framework preset: Next.js (static export)
- Build command: `npm run build`
- Output directory: `out`
- Branch produksi: `main`

## Batasan

- Data `localStorage` tidak tersinkron antar perangkat.
- Hasil print bergantung pada browser dan pengaturan dialog print.
- ATS memiliki aturan berbeda-beda. Template dirancang ATS-conscious, tetapi tidak menjamin kelulusan setiap sistem ATS.

## Tautan

- Portfolio: [ariyoaziz.github.io](https://ariyoaziz.github.io)
- Dukung pengembangan: [Saweria](https://saweria.co/ariyoaziz)

## Lisensi

Tambahkan lisensi yang dipilih maintainer sebelum repository publik dibuka.
