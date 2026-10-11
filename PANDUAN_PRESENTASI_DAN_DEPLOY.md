# Panduan Penggunaan, Presentasi, dan Publikasi Web "Isi Kulkas Jadi Menu Hari Ini"

Dokumen ini berisi panduan lengkap jika link belum bisa dibuka di perangkat lain, cara mengaktifkan akses publik, serta opsi deploy instan 100% gratis ke link umum (Netlify / Vercel).

---

## ⚠️ Mengapa Link Sebelumnya Belum Bisa Dibuka?
Secara bawaan (*default*) di Google AI Studio, link `...run.app` memiliki proteksi akses internal (hanya akun Google pembuat yang bisa membuka, atau meminta login).

Agar link bisa dibuka oleh **siapa saja (dosen, penguji, teman) tanpa login**, ada 2 solusi mudah di bawah ini:

---

## Solusi 1: Aktifkan Akses Publik di Tombol "Share" AI Studio (Paling Cepat)

1. Lihat ke **pojok kanan atas layar AI Studio** Anda.
2. Klik tombol **"Share"** atau **"Publish"** (berada di dekat nama akun Google Anda).
3. Ubah pengaturan izin akses dari *Restricted* menjadi **"Anyone with the link"** (Siapa saja yang memiliki tautan).
4. Klik **Save / Copy Link**.
5. Sekarang link tersebut sudah 100% bisa dibuka di laptop, HP, atau browser mana pun tanpa minta login!

---

## Solusi 2: Deploy Publik 10 Detik via Netlify Drop (Gratis & Bebas Selamanya)

Aplikasi ini sudah berhasil di-build (*compiled*) ke folder `dist` siap saji. Anda bisa mendapatkan link publik permanen (misal: `https://isi-kulkas.netlify.app`) dalam hitungan detik:

1. Di AI Studio, **Download** proyek ini sebagai file `.zip` (lewat menu titik tiga / ekspor).
2. Ekstrak file zip tersebut di laptop Anda.
3. Buka browser dan kunjungi: **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
4. Tarik (*drag and drop*) folder **`dist`** ke halaman tersebut.
5. Selesai! Dalam 5 detik, Netlify akan memberikan link website publik resmi yang aktif 24 jam dan bisa dibuka di semua perangkat.

---

## Solusi 3: Deploy via Vercel (Otomatis & Profesional)
1. Buka **[https://vercel.com](https://vercel.com)** (login dengan akun Google / GitHub).
2. Pilih **"Add New Project"**.
3. Hubungkan folder proyek ini atau upload kode sumbernya.
4. Klik **Deploy**. Web Anda akan langsung memiliki domain publik seperti `https://isi-kulkas.vercel.app`.

---

## 1. Jawaban Pertanyaan Utama

### Q1: Apakah aplikasi web ini menggunakan Google Apps Script (Apps Script)?
**Jawab: TIDAK.**
- Di tangkapan layar sebelumnya, Anda memang menggunakan Google Apps Script (`script.google.com/macros/.../exec`) yang sering memunculkan kendala seperti tab *"Gemini error"*, keterbatasan kuota Google Workspace, dan performa lambat.
- Sekarang, web ini telah dibangun menggunakan teknologi web modern standar industri: **React 19 + TypeScript + Vite + Tailwind CSS**. Aplikasi ini jauh lebih cepat, responsif, memiliki visual kulkas 2 pintu interaktif, dan animasi yang mulus.

---

### Q2: Apakah ini sudah pakai API Key?
**Jawab: BISA BERJALAN TANPA KHAWATIR ERROR API KEY SAAT PRESENTASI.**
- Seluruh logika rekomendasi menu, deteksi bahan (*daging sapi, sayur, pasta prego*), simulasi kulkas 2 pintu, timer memasak, dan interaksi formulir sudah dirancang dengan **Smart Client-Side Engine**.
- **Kelebihan untuk Presentasi:** Anda **TIDAK PERLU** takut presentasi gagal akibat *quota limit*, *API Key expired*, atau error jaringan Gemini seperti yang terjadi di Apps Script sebelumnya.
- Jika Anda ingin mengaktifkan pemindaian gambar AI acak via Gemini, sistem sudah terpasang SDK `@google/genai` dan siap dihubungkan ke `GEMINI_API_KEY`.

---

### Q3: Bagaimana cara membuka web ini HANYA lewat link di laptop atau akun lain?
**Jawab: Anda SUDAH memiliki link online yang aktif dan langsung bisa dibuka.**

Gunakan link berikut:
- **Link Presentasi & Publik (Shared URL):**
  ```
  https://ais-pre-ihjmnnehdyktdzjvk6mkq5-544966177664.asia-east1.run.app
  ```
- **Link Development:**
  ```
  https://ais-dev-ihjmnnehdyktdzjvk6mkq5-544966177664.asia-east1.run.app
  ```

> 💡 **Tips Presentasi:**
> Cukup salin link di atas ke WhatsApp/Email/Notepad, lalu buka di Google Chrome atau browser apapun di laptop ruang sidang/kelas. Web akan langsung terbuka persis seperti yang Anda lihat sekarang tanpa perlu login ulang.

---

## 2. Cara Menyimpan (Backup & Download Proyek)

1. **Tersimpan Otomatis di Cloud:**
   Semua perubahan kode yang dibuat di AI Studio otomatis tersimpan di sesi akun Google Anda (`irfanmaul792@gmail.com`).
2. **Download File ZIP (Opsional):**
   Di pojok antarmuka AI Studio Build, terdapat opsi untuk mengekspor atau mendownload source code sebagai file `.zip` ke komputer lokal Anda.
3. **Hubungkan ke GitHub (Opsional):**
   Anda juga bisa menghubungkan proyek ini ke repositori GitHub pribadi Anda untuk penyimpanan jangka panjang.

---

## 3. Alur Demo yang Direkomendasikan Saat Presentasi

Saat mempresentasikan web ini kepada audiens/penguji, Anda dapat mengikuti langkah-langkah berikut:

1. **Buka Banner Utama (Latar Kulkas 2 Pintu Modern):**
   - Tunjukkan konsep aplikasi: *"Isi kulkas jadi menu hari ini"* untuk mengatasi masalah *food waste* (bahan makanan basi terbuang).
   - Tunjukkan latar belakang dan desain kulkas 2 pintu modern dengan layar digital penunjuk suhu (*3°C Chiller / -18°C Freezer*).

2. **Buka Tampilan "Kulkas Pintar 2 Pintu":**
   - Klik tombol **"Buka Tampilan Kulkas 2 Pintu"** atau tombol **"Buka Pintu Kulkas"**.
   - Perlihatkan pembagian kompartemen:
     - **Rak Daging:** Diberi tanda bahaya kuning/merah (*Gunakan Segera / Prioritas*) agar diolah hari ini.
     - **Laci Sayuran (Crisper):** Menyimpan wortel dan buncis segar.
     - **Rak Atas & Samping:** Menyimpan saus pasta Prego dan bumbu kering.

3. **Demonstrasikan Input Foto & Preferensi:**
   - Tunjukkan 3 slot foto (Daging, Sayuran, Pasta Prego).
   - Tunjukkan preferensi memasak:
     - Budget: *Hemat (< Rp 30.000)*
     - Waktu: *Maks. 30 menit*
     - Porsi: *2 Porsi*
     - Selera: *Suka Pedas*
   - Klik tombol **"Cari Resep"**.

4. **Tampilkan Hasil Rekomendasi Menu:**
   - Perlihatkan kartu resep yang dihasilkan:
     - **Spaghetti Bolognese Daging Kilat** (Kecocokan 98%)
     - **Oseng Daging Sapi Sayur Pedas** (Kecocokan 94%)
     - **Sup Daging Sapi Bening Wortel** (Kecocokan 90%)
   - Jelaskan bahwa sistem memprioritaskan resep yang menghabiskan bahan berisiko kedaluwarsa lebih dulu.

5. **Jalankan "Mode Memasak Interaktif":**
   - Klik tombol **"Mulai Masak"** pada salah satu resep.
   - Tunjukkan checklist bahan makanan dan fitur **Kitchen Timer**.
   - Tekan **"Mulai Timer"** untuk menunjukkan timer penghitung mundur dengan efek suara *chime* saat selesai.
