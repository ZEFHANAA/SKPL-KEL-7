# Dokumentasi Hak Akses Guru - Sistem Absensi Siswa

## 📋 Daftar Isi
1. [Ringkasan Fitur](#ringkasan-fitur)
2. [Fitur yang Diimplementasikan](#fitur-yang-diimplementasikan)
3. [Keamanan dan Otorisasi](#keamanan-dan-otorisasi)
4. [Panduan Penggunaan](#panduan-penggunaan)
5. [Detail Teknis](#detail-teknis)

---

## 🎯 Ringkasan Fitur

Sistem ini mengimplementasikan **Hak Akses Guru** yang membatasi akses guru hanya ke fitur-fitur yang berkaitan dengan proses pembelajaran dan absensi yang menjadi tanggung jawabnya.

### Prinsip Keamanan:
- ✅ Guru hanya dapat melihat jadwal mengajarnya sendiri
- ✅ Guru hanya dapat mengakses data kelas yang diajarnya
- ✅ Guru hanya dapat mengelola absensi untuk kelasnya sendiri
- ✅ Sistem memverifikasi otorisasi pada setiap aksi

---

## 🚀 Fitur yang Diimplementasikan

### 1. **Login ke Sistem** ✓
- **Lokasi**: Halaman login utama
- **Deskripsi**: Guru login menggunakan akun yang dibuat oleh Admin
- **Akun Demo**: 
  - Username: `guru1`
  - Password: `guru123`
- **Fitur Keamanan**:
  - Autentikasi kredensial
  - Session management
  - Role-based access control

---

### 2. **Melihat Jadwal Mengajar Sendiri** ✓

#### Dashboard Guru
- **Menu**: Dashboard (default page)
- **Fitur**:
  - Menampilkan jadwal hari ini
  - Status absensi (sudah/belum absen)
  - Statistik jadwal mengajar
  - Tabel semua jadwal dengan tombol "Lihat Detail"

#### Halaman Jadwal Mengajar Lengkap
- **Menu**: Jadwal Mengajar
- **Fitur**:
  - Jadwal dikelompokkan per hari (Senin-Sabtu)
  - Informasi lengkap: Jam, Kelas, Mata Pelajaran, Durasi
  - Statistik: Total jadwal, jumlah kelas, jumlah mata pelajaran
  - Tombol unduh jadwal dalam format CSV
  - **PENTING**: Hanya menampilkan jadwal guru yang login, tidak dapat melihat jadwal guru lain

#### Popup Detail Jadwal
- Klik tombol "Lihat Detail" di Dashboard
- Tampilan terorganisir per hari
- Color-coded untuk mudah dibaca
- Opsi cetak/unduh jadwal

---

### 3. **Mencatat Absensi Siswa (Real-time)** ✓

#### Menu Input Absensi
- **Menu**: Input Absensi
- **Fitur**:
  - Daftar semua jadwal mengajar
  - Filter otomatis jadwal hari ini
  - Status: "Sudah Absen Hari Ini" atau "Belum Absen"
  - Tombol "Mulai Absensi" untuk jadwal yang belum diabsen

#### Form Input Absensi
- **Status Kehadiran**:
  - ✅ Hadir
  - 📝 Izin
  - 🤒 Sakit
  - ❌ Alpa
- **Fitur**:
  - Input real-time untuk semua siswa di kelas
  - Field keterangan opsional untuk setiap siswa
  - Tampilan tabel dengan NISN dan nama siswa
  - Validasi: Hanya dapat input untuk kelas yang diajar
  - Notifikasi otomatis ke orang tua untuk siswa alpa

---

### 4. **Mengubah Data Absensi** ✓ (FITUR BARU)

#### Cara Akses:
1. Buka menu "Input Absensi" atau "Dashboard"
2. Klik tombol "Lihat" pada jadwal yang sudah diabsen
3. Klik tombol edit (icon pensil) pada baris siswa

#### Fitur Edit Absensi:
- **Popup Edit**: Form untuk mengubah status dan keterangan
- **Status yang dapat diubah**: Hadir, Izin, Sakit, Alpa
- **Keterangan**: Dapat diperbarui
- **Keamanan**: 
  - ✅ Hanya dapat edit absensi untuk kelas yang diajar
  - ✅ Sistem mencatat waktu edit
  - ✅ Log aktivitas tersimpan

#### Batasan:
- Hanya untuk jadwal dan kelas yang menjadi kewenangan guru tersebut
- Validasi otorisasi pada setiap permintaan edit

---

### 5. **Melihat Riwayat Absensi** ✓

#### Menu Riwayat Absensi
- **Menu**: Riwayat Absensi
- **Filter**:
  - Filter berdasarkan tanggal
  - Filter berdasarkan jadwal (kelas & mata pelajaran)
  - Tampilan default: Absensi hari ini

#### Informasi yang Ditampilkan:
- Ringkasan statistik:
  - Jumlah Hadir
  - Jumlah Izin
  - Jumlah Sakit
  - Jumlah Alpa
- Tabel detail per siswa:
  - Nama Siswa
  - Kelas
  - Mata Pelajaran
  - Status Kehadiran
  - Keterangan

#### Batasan:
- **HANYA menampilkan riwayat untuk**:
  - Kelas yang diajar oleh guru tersebut
  - Mata pelajaran yang diampu
  - Tidak dapat melihat riwayat guru lain

---

### 6. **Mencetak / Mengunduh Laporan Absensi** ✓ (FITUR BARU)

#### Laporan Absensi Harian
- **Lokasi**: Popup Detail Absensi (setelah klik "Lihat")
- **Tombol**: "Unduh Laporan" (icon download)
- **Format**: CSV (dapat dibuka di Excel)
- **Isi Laporan**:
  - Header: Mata Pelajaran, Kelas, Tanggal, Nama Guru
  - Daftar siswa dengan status kehadiran
  - Ringkasan statistik (Hadir, Izin, Sakit, Alpa, Total)
- **Nama File**: `Absensi_[Kelas]_[Mapel]_[Tanggal].csv`

#### Laporan Riwayat Absensi
- **Lokasi**: Menu Riwayat Absensi
- **Tombol**: "Unduh Laporan" (di header card)
- **Format**: CSV
- **Isi Laporan**:
  - Header: Nama Guru, Tanggal
  - Daftar absensi sesuai filter yang dipilih
  - Detail: Nama Siswa, Kelas, Mata Pelajaran, Status, Keterangan
  - Ringkasan statistik
- **Nama File**: `Riwayat_Absensi_[Tanggal].csv`

#### Laporan Jadwal Mengajar
- **Lokasi**: Menu Jadwal Mengajar
- **Tombol**: "Unduh Jadwal"
- **Format**: CSV
- **Isi Laporan**:
  - Header: Nama Guru, Tanggal Cetak
  - Jadwal dikelompokkan per hari
  - Detail: Jam, Kelas, Mata Pelajaran
- **Nama File**: `Jadwal_Mengajar_[Nama_Guru].csv`

#### Batasan Laporan:
- ✅ Hanya data kelas yang diajar oleh guru tersebut
- ✅ Tidak dapat mengakses laporan guru lain
- ✅ Tidak dapat melihat laporan global sekolah (khusus admin)

---

## 🔒 Keamanan dan Otorisasi

### Fungsi Otorisasi Baru (auth.js)

```javascript
// 1. Cek akses ke jadwal tertentu
Auth.canAccessSchedule(jadwalId)
// Return: true jika jadwal milik guru yang login

// 2. Cek akses ke kelas tertentu
Auth.canAccessClass(kelasId)
// Return: true jika guru mengajar di kelas tersebut

// 3. Cek akses untuk edit absensi
Auth.canEditAttendance(absensiId)
// Return: true jika absensi terkait dengan jadwal guru

// 4. Dapatkan semua jadwal ID guru
Auth.getTeacherScheduleIds()
// Return: Array of jadwal IDs yang diajar guru
```

### Implementasi Keamanan:

1. **Setiap fungsi diproteksi dengan pengecekan otorisasi**
   ```javascript
   if (!Auth.canAccessSchedule(jadwalId)) {
       App.showNotification('Anda tidak memiliki akses!', 'error');
       return;
   }
   ```

2. **Filter data berdasarkan guru**
   - Jadwal: Hanya jadwal dengan `guruId` sesuai
   - Absensi: Hanya absensi dari jadwal guru tersebut
   - Kelas: Hanya kelas yang diajar guru

3. **Log aktivitas**
   - Semua aksi dicatat (input absensi, edit, ekspor)
   - Audit trail untuk keamanan

---

## 📖 Panduan Penggunaan

### Untuk Guru:

#### 1. Login
1. Buka aplikasi
2. Masukkan username dan password dari Admin
3. Klik "Login"

#### 2. Melihat Jadwal
**Opsi A - Dari Dashboard:**
- Lihat "Jadwal Hari Ini" di bagian atas
- Lihat "Semua Jadwal Mengajar" di bagian bawah
- Klik "Lihat Detail" untuk popup jadwal lengkap

**Opsi B - Menu Jadwal Mengajar:**
- Klik menu "Jadwal Mengajar" di sidebar
- Lihat jadwal lengkap per hari
- Klik "Unduh Jadwal" untuk ekspor

#### 3. Input Absensi
1. Klik menu "Input Absensi" atau tombol "Mulai Absensi" di Dashboard
2. Pilih jadwal yang akan diabsen
3. Tandai status setiap siswa (Hadir/Izin/Sakit/Alpa)
4. Isi keterangan jika diperlukan
5. Klik "Simpan Absensi"

#### 4. Edit Absensi (Koreksi)
1. Buka menu "Input Absensi" atau Dashboard
2. Klik tombol "Lihat" pada jadwal yang sudah diabsen
3. Klik icon edit (pensil) pada siswa yang ingin dikoreksi
4. Ubah status atau keterangan
5. Klik "Simpan Perubahan"

#### 5. Lihat Riwayat
1. Klik menu "Riwayat Absensi"
2. Pilih tanggal yang diinginkan
3. Filter berdasarkan jadwal (opsional)
4. Lihat statistik dan detail absensi

#### 6. Unduh Laporan
**Laporan Absensi Harian:**
- Buka detail absensi (tombol "Lihat")
- Klik "Unduh Laporan"

**Laporan Riwayat:**
- Buka menu "Riwayat Absensi"
- Set filter tanggal dan jadwal
- Klik "Unduh Laporan" di bagian atas

**Laporan Jadwal:**
- Buka menu "Jadwal Mengajar"
- Klik "Unduh Jadwal"

---

## 🔧 Detail Teknis

### File yang Dimodifikasi:

1. **auth.js**
   - Ditambahkan fungsi otorisasi: `canAccessSchedule()`, `canAccessClass()`, `canEditAttendance()`, `getTeacherScheduleIds()`

2. **guru.js**
   - Ditambahkan fungsi: `editAbsensi()`, `exportAbsensiToday()`, `exportRiwayatAbsensi()`, `viewDetailedSchedule()`, `exportScheduleToPDF()`, `renderJadwalGuru()`
   - Diperbarui fungsi: `lihatAbsensi()`, `mulaiAbsensi()`, `renderDashboard()`, `renderRiwayat()`

3. **app.js**
   - Ditambahkan menu "Jadwal Mengajar" untuk role guru

### Alur Data:

```
User Login (Guru)
    ↓
Auth.getUser() → Dapatkan ID User
    ↓
DataStore.get('guru') → Cari guru berdasarkan userId
    ↓
DataStore.get('jadwal') → Filter jadwal berdasarkan guruId
    ↓
Tampilkan data HANYA untuk jadwal guru tersebut
```

### Keamanan:
- **Client-side validation**: Semua fungsi cek otorisasi sebelum eksekusi
- **Data filtering**: Query hanya mengambil data yang relevan
- **Session management**: User disimpan di sessionStorage
- **Log audit**: Semua aktivitas tercatat

---

## ✅ Checklist Fitur Sesuai Requirement

| No | Requirement | Status | Lokasi Fitur |
|----|-------------|--------|--------------|
| 1 | Login ke sistem | ✅ Implemented | Halaman Login |
| 2 | Melihat jadwal mengajar sendiri | ✅ Implemented | Dashboard, Menu Jadwal Mengajar |
| 3 | Mencatat absensi siswa (real-time) | ✅ Implemented | Menu Input Absensi |
| 4 | Status: Hadir, Izin, Sakit, Alpa | ✅ Implemented | Form Input Absensi |
| 5 | Hanya untuk kelas yang diajar | ✅ Implemented | Validasi otorisasi |
| 6 | Mengubah data absensi | ✅ **NEW** | Popup Edit Absensi |
| 7 | Dalam kewenangan kelas dan sesi | ✅ Implemented | Validasi `canEditAttendance()` |
| 8 | Melihat riwayat absensi | ✅ Implemented | Menu Riwayat Absensi |
| 9 | Riwayat untuk kelas yang diajar | ✅ Implemented | Filter berdasarkan jadwal guru |
| 10 | Riwayat untuk mata pelajaran yang diampu | ✅ Implemented | Otomatis terfilter |
| 11 | Mencetak/unduh laporan absensi | ✅ **NEW** | Tombol "Unduh Laporan" |
| 12 | Laporan terbatas untuk kelasnya | ✅ Implemented | Validasi otorisasi ekspor |
| 13 | Bukan laporan global sekolah | ✅ Implemented | Hanya data guru tersebut |

---

## 🎓 Demo Akun

### Akun Guru untuk Testing:

**Guru 1:**
- Username: `guru1`
- Password: `guru123`
- Nama: Budi Santoso, S.Pd
- Mengajar: Matematika, Fisika

**Guru 2:**
- Username: `guru2`
- Password: `guru123`
- Nama: Siti Rahayu, S.Pd
- Mengajar: Bahasa Indonesia

**Guru 3:**
- Username: `guru3`
- Password: `guru123`
- Nama: Ahmad Wijaya, M.Pd
- Mengajar: Bahasa Inggris, Kimia

---

## 📝 Catatan Penting

1. **Keamanan**: Semua aksi guru divalidasi dengan fungsi otorisasi
2. **Batasan Akses**: Guru tidak dapat:
   - Melihat jadwal guru lain
   - Mengakses kelas yang tidak diajar
   - Melihat laporan global
   - Mengubah data di luar kewenangannya
3. **Format Laporan**: CSV dapat dibuka di Excel atau aplikasi spreadsheet lainnya
4. **Browser**: Kompatibel dengan Chrome, Firefox, Edge, Safari
5. **Data**: Tersimpan di localStorage browser

---

## 🎉 Kesimpulan

Sistem **Hak Akses Guru** telah diimplementasikan dengan lengkap sesuai requirement. Semua fitur telah dilengkapi dengan:
- ✅ Validasi otorisasi
- ✅ Filter data berbasis role
- ✅ Fitur ekspor/unduh laporan
- ✅ Edit absensi dengan audit trail
- ✅ User interface yang intuitif
- ✅ Keamanan berlapis

Guru dapat dengan mudah mengelola absensi, melihat jadwal, dan mengunduh laporan - semuanya terbatas pada kelas dan mata pelajaran yang menjadi tanggung jawabnya.
