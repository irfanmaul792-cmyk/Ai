# Catatan Perubahan - Resep dari Isi Kulkas

## Yang diperbaiki

- Weekly Meal Planner kini menyusun jadwal otomatis dengan memprioritaskan resep yang cocok dengan bahan bertanda urgent atau memiliki estimasi sisa masa simpan <= 3 hari, lalu mempertimbangkan bahan medium dan variasi resep.
- Perbaikan urutan React Hooks di WeeklyMealPlannerModal agar tidak terjadi perubahan jumlah hooks saat modal dibuka/ditutup.
- Daftar belanja mingguan menggabungkan nama bahan dan menampilkan jumlah takaran unik dari resep yang memerlukannya; kategori bahan diinferensikan dari inventaris atau nama bahan.
- Tombol khusus untuk menyalin daftar belanja ke format yang rapi untuk WhatsApp, serta penanganan kegagalan clipboard.
- Jadwal dan daftar belanja tetap menggunakan penyimpanan serta komponen proyek yang sudah ada.
- Analisis foto kulkas/struk tidak lagi menampilkan bahan contoh palsu ketika Gemini API tidak tersedia atau gagal. API mengembalikan pesan error yang jelas.
- Endpoint Vision di backend utama dan endpoint serverless mendukung metadata struk: jenis struk, nama toko, tanggal transaksi, total belanja, kuantitas, dan harga per item jika terbaca.
- Penyimpanan hasil deteksi menghindari nama bahan duplikat dan memvalidasi kategori/urgensi/rak sebelum dimasukkan ke inventaris.
- Hasil Vision sebelumnya dibersihkan ketika analisis foto baru dimulai agar hasil lama tidak tersimpan secara tidak sengaja.

## Konfigurasi yang dibutuhkan

Pastikan `GEMINI_API_KEY` diatur sebagai environment variable/secret di lingkungan tempat backend dijalankan. Tanpa kunci tersebut, analisis foto asli akan memberi pesan bahwa Gemini belum dikonfigurasi, bukan mengarang hasil deteksi.

## Pengujian

Pemeriksaan build penuh belum dapat diselesaikan di lingkungan kerja ini karena dependensi npm tidak berhasil terpasang dalam batas waktu, sehingga `vite/client`, React, Express, dan SDK Gemini tidak tersedia untuk TypeScript. Pemeriksaan parser TypeScript tidak menemukan kesalahan sintaks pada file yang diperiksa, tetapi aplikasi tetap perlu diuji dengan `npm install`, `npm run lint`, dan `npm run build` di lingkungan proyek.

## Catatan akurasi

Daftar belanja menggabungkan takaran yang tertulis pada resep, tetapi tidak dapat menghitung sisa stok secara matematis jika jumlah inventaris tidak memiliki satuan/kuantitas yang sebanding. Dalam kondisi tersebut, status stok adalah perkiraan berdasarkan keberadaan nama bahan.
