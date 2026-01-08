# QUICK REFERENCE - HAK AKSES GURU

## 🚀 QUICK START

### Login Demo
```
Username: guru1
Password: guru123
```

## 📋 MENU GURU

| Menu | Fungsi | Fitur Utama |
|------|--------|-------------|
| 📊 Dashboard | Halaman utama | Jadwal hari ini, statistik, tombol aksi cepat |
| 📅 Jadwal Mengajar | Lihat jadwal lengkap | Jadwal per hari, unduh jadwal |
| 📝 Input Absensi | Input kehadiran siswa | Mulai absensi, lihat & edit absensi |
| 📜 Riwayat Absensi | Lihat riwayat | Filter tanggal/jadwal, unduh laporan |

## ⚡ QUICK ACTIONS

### Input Absensi Cepat
1. Dashboard → Klik "Mulai Absensi" pada jadwal
2. Tandai status siswa (✅ Hadir, 📝 Izin, 🤒 Sakit, ❌ Alpa)
3. Klik "Simpan Absensi"

### Edit Absensi
1. Dashboard/Input Absensi → Klik "Lihat"
2. Klik icon ✏️ pada siswa yang akan diedit
3. Ubah status/keterangan → "Simpan Perubahan"

### Unduh Laporan
- **Absensi Harian**: Detail Absensi → "Unduh Laporan"
- **Riwayat**: Menu Riwayat → "Unduh Laporan"
- **Jadwal**: Menu Jadwal Mengajar → "Unduh Jadwal"

## 🔒 BATASAN AKSES

| Dapat ✅ | Tidak Dapat ❌ |
|----------|----------------|
| Lihat jadwal sendiri | Lihat jadwal guru lain |
| Input absensi kelas yang diajar | Input absensi kelas lain |
| Edit absensi kelasnya | Edit absensi kelas lain |
| Unduh laporan kelasnya | Unduh laporan global |
| Lihat riwayat kelasnya | Lihat riwayat semua kelas |

## 📥 FORMAT LAPORAN

Semua laporan dalam format **CSV** (dapat dibuka di Excel):

1. **Laporan Absensi Harian**
   - Nama file: `Absensi_[Kelas]_[Mapel]_[Tanggal].csv`
   - Isi: Daftar siswa + status + ringkasan

2. **Laporan Riwayat Absensi**
   - Nama file: `Riwayat_Absensi_[Tanggal].csv`
   - Isi: Riwayat sesuai filter + statistik

3. **Laporan Jadwal Mengajar**
   - Nama file: `Jadwal_Mengajar_[Nama_Guru].csv`
   - Isi: Jadwal lengkap per hari

## 🎯 STATUS KEHADIRAN

| Icon | Status | Keterangan |
|------|--------|------------|
| ✅ | Hadir | Siswa hadir di kelas |
| 📝 | Izin | Siswa izin dengan keterangan |
| 🤒 | Sakit | Siswa sakit (surat dokter) |
| ❌ | Alpa | Siswa tidak hadir tanpa keterangan |

## 🔐 KEAMANAN

### Validasi Otomatis
Setiap aksi divalidasi:
- ✅ Cek apakah jadwal milik guru tersebut
- ✅ Cek apakses ke kelas yang diajar
- ✅ Cek hak edit absensi
- ✅ Log aktivitas tercatat

### Notifikasi Error
Jika tidak punya akses:
> "Anda tidak memiliki akses ke jadwal ini!"

## 💡 TIPS & TRIK

1. **Input Cepat**: Gunakan tab untuk berpindah antar field
2. **Filter Efektif**: Gunakan filter tanggal untuk cari riwayat spesifik
3. **Unduh Regular**: Unduh laporan secara berkala untuk backup
4. **Edit Hati-hati**: Periksa sebelum simpan perubahan absensi
5. **Keterangan Jelas**: Isi keterangan untuk Izin/Sakit

## 🐛 TROUBLESHOOTING

### Tombol tidak muncul?
- Pastikan sudah login sebagai guru
- Refresh halaman (F5)

### Tidak bisa edit absensi?
- Cek apakah jadwal tersebut milik Anda
- Hanya bisa edit absensi kelas yang diajar

### Laporan tidak terunduh?
- Cek browser tidak memblokir download
- Pastikan ada data untuk diekspor

### Tidak lihat jadwal?
- Pastikan admin sudah assign jadwal ke guru
- Cek role: harus login sebagai "guru"

## 📱 SHORTCUT KEYBOARD

| Key | Fungsi |
|-----|--------|
| `Esc` | Tutup popup/modal |
| `Tab` | Pindah ke field berikutnya |
| `Enter` | Submit form |
| `F5` | Refresh halaman |

## 🎓 WORKFLOW HARIAN

### Pagi Hari
1. Login ke sistem
2. Cek jadwal hari ini di Dashboard
3. Siapkan materi mengajar

### Saat Mengajar
1. Buka menu "Input Absensi"
2. Pilih jadwal yang sedang berlangsung
3. Input kehadiran siswa real-time
4. Simpan absensi

### Akhir Hari
1. Review riwayat absensi
2. Koreksi jika ada kesalahan input
3. Unduh laporan untuk arsip

### Akhir Minggu
1. Unduh laporan mingguan
2. Evaluasi kehadiran siswa
3. Follow up siswa yang sering alpa

## 📞 BANTUAN

### Dokumentasi Lengkap
- `DOKUMENTASI_HAK_AKSES_GURU.md` - Panduan detail
- `PANDUAN_VISUAL.md` - Panduan dengan gambar
- `RINGKASAN_IMPLEMENTASI.md` - Ringkasan fitur

### Demo Akun
| Username | Password | Nama | Mapel |
|----------|----------|------|-------|
| guru1 | guru123 | Budi Santoso | Matematika, Fisika |
| guru2 | guru123 | Siti Rahayu | Bahasa Indonesia |
| guru3 | guru123 | Ahmad Wijaya | Bahasa Inggris, Kimia |

## ✅ CHECKLIST HARIAN

- [ ] Login ke sistem
- [ ] Cek jadwal hari ini
- [ ] Input absensi setiap kelas
- [ ] Periksa siswa yang alpa
- [ ] Update keterangan jika diperlukan
- [ ] Unduh laporan (opsional)
- [ ] Logout

## 🎉 FITUR UNGGULAN

### 🆕 Baru di Versi Ini
1. **Menu Jadwal Mengajar Lengkap** - Terorganisir per hari
2. **Edit Absensi** - Koreksi kesalahan dengan mudah
3. **Unduh 3 Jenis Laporan** - CSV format (Excel compatible)
4. **Validasi Keamanan Berlapis** - Data aman dan terlindungi
5. **UI/UX Improved** - Lebih intuitif dan user-friendly

## 🔄 UPDATE LOG

**Versi 2.0 (8 Januari 2026)**
- ✅ Tambah menu "Jadwal Mengajar"
- ✅ Fitur edit absensi
- ✅ Ekspor laporan CSV (3 jenis)
- ✅ Enhanced security & authorization
- ✅ Improved UI/UX

---

**🎯 SISTEM SIAP DIGUNAKAN!**

Semua fitur Hak Akses Guru telah diimplementasikan dengan lengkap dan aman. Selamat menggunakan! 🎓✨
