# Sistem Absensi Siswa

Website sistem absensi siswa berbasis HTML, CSS, dan JavaScript murni (tanpa backend).

## 🚀 Fitur Lengkap

### 👨‍💼 Admin
- Dashboard dengan statistik lengkap
- Manajemen Pengguna (CRUD)
- Data Siswa, Guru, Kelas, Mata Pelajaran
- Jadwal Pelajaran
- Rekap & Validasi Absensi
- Laporan (per siswa, kelas, periode)
- Log Aktivitas

### 👨‍🏫 Guru
- Dashboard dengan jadwal mengajar
- **Jadwal Mengajar Lengkap** (per hari, terorganisir) 🆕
- Input Absensi (Hadir/Izin/Sakit/Alpa)
- **Edit Absensi** (koreksi kesalahan input) 🆕
- Riwayat Absensi
- **Unduh Laporan** (CSV format): 🆕
  - Laporan Absensi Harian
  - Laporan Riwayat Absensi
  - Laporan Jadwal Mengajar
- **Keamanan**: Hanya akses data kelas yang diajar

### 👨‍🎓 Siswa & Orang Tua
- Dashboard dengan grafik kehadiran
- Riwayat Absensi lengkap
- Rekap Bulanan

## 🔑 Akun Demo

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Guru | guru1 | guru123 |
| Siswa | siswa1 | siswa123 |
| Orang Tua | ortu1 | ortu123 |

## 📁 Struktur Folder

```
PROJECT RPL SKPL/
├── index.html          # Halaman utama
├── css/
│   └── style.css      # Styling lengkap & responsive
└── js/
    ├── data.js        # Database & data management
    ├── auth.js        # Authentication system
    ├── app.js         # Main application logic
    ├── admin.js       # Modul Admin
    ├── guru.js        # Modul Guru
    └── siswa.js       # Modul Siswa & Orang Tua
```

## 🛠️ Teknologi

- **HTML5** - Struktur halaman
- **CSS3** - Styling & responsive design
- **JavaScript (Vanilla)** - Logic & interaksi
- **LocalStorage** - Penyimpanan data di browser

## 📱 Responsive Design

Website sudah **fully responsive** dan support:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🎯 Cara Menggunakan

1. Clone atau download repository ini
2. Buka file `index.html` di browser
3. Login menggunakan akun demo di atas
4. Sistem siap digunakan!

## 💾 Penyimpanan Data

Data disimpan di **localStorage** browser, sehingga:
- ✅ Data tetap tersimpan meskipun browser ditutup
- ✅ Tidak perlu server atau database
- ⚠️ Data akan hilang jika localStorage dibersihkan
- ⚠️ Data hanya tersimpan di browser yang sama

## 🆕 Update Terbaru - Hak Akses Guru

### Fitur Baru yang Ditambahkan:
1. **Menu Jadwal Mengajar Lengkap**
   - Jadwal terorganisir per hari (Senin-Sabtu)
   - Statistik: Total jadwal, jumlah kelas, mata pelajaran
   - Tombol unduh jadwal dalam format CSV

2. **Edit Absensi**
   - Guru dapat mengoreksi kesalahan input absensi
   - Validasi otorisasi (hanya untuk kelas yang diajar)
   - Log aktivitas untuk audit trail

3. **Unduh Laporan (3 Jenis)**
   - **Laporan Absensi Harian**: Detail kehadiran per sesi
   - **Laporan Riwayat Absensi**: Riwayat sesuai filter
   - **Laporan Jadwal Mengajar**: Jadwal lengkap per hari
   - Format: CSV (dapat dibuka di Excel)

4. **Keamanan & Otorisasi**
   - Validasi berlapis untuk setiap aksi
   - Guru hanya dapat mengakses data kelasnya sendiri
   - Tidak dapat melihat jadwal atau data guru lain
   - Authorization helpers di `auth.js`

### Dokumentasi Lengkap:
- `DOKUMENTASI_HAK_AKSES_GURU.md` - Panduan detail semua fitur
- `PANDUAN_VISUAL.md` - Panduan dengan diagram visual
- `RINGKASAN_IMPLEMENTASI.md` - Ringkasan implementasi
- `QUICK_REFERENCE.md` - Referensi cepat untuk penggunaan

### Testing:
Login dengan akun guru (`guru1` / `guru123`) untuk mencoba semua fitur baru!

## 📝 Lisensi

Project ini dibuat untuk keperluan pembelajaran dan dapat digunakan secara bebas.

## 👨‍💻 Developer

Dibuat dengan ❤️ menggunakan HTML, CSS, dan JavaScript
