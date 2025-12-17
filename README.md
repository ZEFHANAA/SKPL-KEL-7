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
- Input Absensi (Hadir/Izin/Sakit/Alpa)
- Riwayat Absensi

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

## 📝 Lisensi

Project ini dibuat untuk keperluan pembelajaran dan dapat digunakan secara bebas.

## 👨‍💻 Developer

Dibuat dengan ❤️ menggunakan HTML, CSS, dan JavaScript
