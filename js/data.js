// ===== DATA STORE =====
// Simulasi database menggunakan localStorage

const DataStore = {
    // Inisialisasi data awal
    init() {
        if (!localStorage.getItem('dataInitialized')) {
            this.seedData();
            localStorage.setItem('dataInitialized', 'true');
        }
    },

    // Data seed awal
    seedData() {
        // Users
        const users = [
            { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator', email: 'admin@sekolah.id' },
            { id: 2, username: 'guru1', password: 'guru123', role: 'guru', name: 'Budi Santoso, S.Pd', email: 'budi@sekolah.id', nip: '198501152010011001' },
            { id: 3, username: 'guru2', password: 'guru123', role: 'guru', name: 'Siti Rahayu, S.Pd', email: 'siti@sekolah.id', nip: '198703202011012002' },
            { id: 4, username: 'guru3', password: 'guru123', role: 'guru', name: 'Ahmad Wijaya, M.Pd', email: 'ahmad@sekolah.id', nip: '198206102009011003' },
            { id: 5, username: 'siswa1', password: 'siswa123', role: 'siswa', name: 'Andi Pratama', email: 'andi@siswa.id', nisn: '0012345678', kelasId: 1 },
            { id: 6, username: 'siswa2', password: 'siswa123', role: 'siswa', name: 'Dewi Lestari', email: 'dewi@siswa.id', nisn: '0012345679', kelasId: 1 },
            { id: 7, username: 'ortu1', password: 'ortu123', role: 'ortu', name: 'Pak Pratama', email: 'pratama@email.com', anakId: 5 },
        ];

        // Kelas
        const kelas = [
            { id: 1, nama: 'X IPA 1', tingkat: 'X', jurusan: 'IPA', waliKelasId: 2 },
            { id: 2, nama: 'X IPA 2', tingkat: 'X', jurusan: 'IPA', waliKelasId: 3 },
            { id: 3, nama: 'X IPS 1', tingkat: 'X', jurusan: 'IPS', waliKelasId: 4 },
            { id: 4, nama: 'XI IPA 1', tingkat: 'XI', jurusan: 'IPA', waliKelasId: 2 },
            { id: 5, nama: 'XI IPS 1', tingkat: 'XI', jurusan: 'IPS', waliKelasId: 3 },
            { id: 6, nama: 'XII IPA 1', tingkat: 'XII', jurusan: 'IPA', waliKelasId: 4 },
        ];

        // Siswa
        const siswa = [
            { id: 1, nama: 'Andi Pratama', nisn: '0012345678', kelasId: 1, jenisKelamin: 'L', tempatLahir: 'Jakarta', tanggalLahir: '2008-05-15', alamat: 'Jl. Merdeka No. 10', noTelp: '081234567890', userId: 5 },
            { id: 2, nama: 'Dewi Lestari', nisn: '0012345679', kelasId: 1, jenisKelamin: 'P', tempatLahir: 'Bandung', tanggalLahir: '2008-07-20', alamat: 'Jl. Asia Afrika No. 5', noTelp: '081234567891', userId: 6 },
            { id: 3, nama: 'Rudi Hermawan', nisn: '0012345680', kelasId: 1, jenisKelamin: 'L', tempatLahir: 'Surabaya', tanggalLahir: '2008-03-10', alamat: 'Jl. Pahlawan No. 15', noTelp: '081234567892', userId: null },
            { id: 4, nama: 'Sari Indah', nisn: '0012345681', kelasId: 1, jenisKelamin: 'P', tempatLahir: 'Yogyakarta', tanggalLahir: '2008-09-25', alamat: 'Jl. Malioboro No. 20', noTelp: '081234567893', userId: null },
            { id: 5, nama: 'Bima Sakti', nisn: '0012345682', kelasId: 1, jenisKelamin: 'L', tempatLahir: 'Semarang', tanggalLahir: '2008-01-30', alamat: 'Jl. Pandanaran No. 8', noTelp: '081234567894', userId: null },
            { id: 6, nama: 'Putri Ayu', nisn: '0012345683', kelasId: 2, jenisKelamin: 'P', tempatLahir: 'Medan', tanggalLahir: '2008-11-12', alamat: 'Jl. Sudirman No. 30', noTelp: '081234567895', userId: null },
            { id: 7, nama: 'Fajar Nugraha', nisn: '0012345684', kelasId: 2, jenisKelamin: 'L', tempatLahir: 'Palembang', tanggalLahir: '2008-04-18', alamat: 'Jl. Jenderal Sudirman No. 40', noTelp: '081234567896', userId: null },
            { id: 8, nama: 'Maya Sari', nisn: '0012345685', kelasId: 2, jenisKelamin: 'P', tempatLahir: 'Makassar', tanggalLahir: '2008-08-22', alamat: 'Jl. Pettarani No. 50', noTelp: '081234567897', userId: null },
            { id: 9, nama: 'Doni Setiawan', nisn: '0012345686', kelasId: 3, jenisKelamin: 'L', tempatLahir: 'Bali', tanggalLahir: '2008-06-05', alamat: 'Jl. Sunset Road No. 60', noTelp: '081234567898', userId: null },
            { id: 10, nama: 'Rina Wati', nisn: '0012345687', kelasId: 3, jenisKelamin: 'P', tempatLahir: 'Lombok', tanggalLahir: '2008-12-28', alamat: 'Jl. Senggigi No. 70', noTelp: '081234567899', userId: null },
        ];

        // Guru
        const guru = [
            { id: 1, nama: 'Budi Santoso, S.Pd', nip: '198501152010011001', jenisKelamin: 'L', tempatLahir: 'Solo', tanggalLahir: '1985-01-15', alamat: 'Jl. Slamet Riyadi No. 100', noTelp: '082345678901', email: 'budi@sekolah.id', mapelId: [1, 2], userId: 2 },
            { id: 2, nama: 'Siti Rahayu, S.Pd', nip: '198703202011012002', jenisKelamin: 'P', tempatLahir: 'Malang', tanggalLahir: '1987-03-20', alamat: 'Jl. Ijen No. 50', noTelp: '082345678902', email: 'siti@sekolah.id', mapelId: [3], userId: 3 },
            { id: 3, nama: 'Ahmad Wijaya, M.Pd', nip: '198206102009011003', jenisKelamin: 'L', tempatLahir: 'Bekasi', tanggalLahir: '1982-06-10', alamat: 'Jl. Ahmad Yani No. 200', noTelp: '082345678903', email: 'ahmad@sekolah.id', mapelId: [4, 5], userId: 4 },
        ];

        // Mata Pelajaran
        const mapel = [
            { id: 1, nama: 'Matematika', kode: 'MTK', deskripsi: 'Pelajaran Matematika' },
            { id: 2, nama: 'Fisika', kode: 'FIS', deskripsi: 'Pelajaran Fisika' },
            { id: 3, nama: 'Bahasa Indonesia', kode: 'BIN', deskripsi: 'Pelajaran Bahasa Indonesia' },
            { id: 4, nama: 'Bahasa Inggris', kode: 'BIG', deskripsi: 'Pelajaran Bahasa Inggris' },
            { id: 5, nama: 'Kimia', kode: 'KIM', deskripsi: 'Pelajaran Kimia' },
            { id: 6, nama: 'Biologi', kode: 'BIO', deskripsi: 'Pelajaran Biologi' },
            { id: 7, nama: 'Sejarah', kode: 'SEJ', deskripsi: 'Pelajaran Sejarah' },
            { id: 8, nama: 'Ekonomi', kode: 'EKO', deskripsi: 'Pelajaran Ekonomi' },
        ];

        // Jadwal Pelajaran
        const jadwal = [
            { id: 1, kelasId: 1, mapelId: 1, guruId: 1, hari: 'Senin', jamMulai: '07:00', jamSelesai: '08:30' },
            { id: 2, kelasId: 1, mapelId: 3, guruId: 2, hari: 'Senin', jamMulai: '08:30', jamSelesai: '10:00' },
            { id: 3, kelasId: 1, mapelId: 4, guruId: 3, hari: 'Senin', jamMulai: '10:15', jamSelesai: '11:45' },
            { id: 4, kelasId: 1, mapelId: 2, guruId: 1, hari: 'Selasa', jamMulai: '07:00', jamSelesai: '08:30' },
            { id: 5, kelasId: 1, mapelId: 5, guruId: 3, hari: 'Selasa', jamMulai: '08:30', jamSelesai: '10:00' },
            { id: 6, kelasId: 2, mapelId: 1, guruId: 1, hari: 'Senin', jamMulai: '10:15', jamSelesai: '11:45' },
            { id: 7, kelasId: 2, mapelId: 3, guruId: 2, hari: 'Selasa', jamMulai: '07:00', jamSelesai: '08:30' },
            { id: 8, kelasId: 3, mapelId: 4, guruId: 3, hari: 'Rabu', jamMulai: '07:00', jamSelesai: '08:30' },
            { id: 9, kelasId: 1, mapelId: 1, guruId: 1, hari: 'Rabu', jamMulai: '07:00', jamSelesai: '08:30' },
            { id: 10, kelasId: 1, mapelId: 3, guruId: 2, hari: 'Kamis', jamMulai: '07:00', jamSelesai: '08:30' },
            { id: 11, kelasId: 1, mapelId: 2, guruId: 1, hari: 'Kamis', jamMulai: '08:30', jamSelesai: '10:00' },
            { id: 12, kelasId: 2, mapelId: 2, guruId: 1, hari: 'Kamis', jamMulai: '10:15', jamSelesai: '11:45' },
            { id: 13, kelasId: 1, mapelId: 1, guruId: 1, hari: 'Jumat', jamMulai: '07:00', jamSelesai: '08:30' },
            { id: 14, kelasId: 2, mapelId: 1, guruId: 1, hari: 'Jumat', jamMulai: '08:30', jamSelesai: '10:00' },
        ];

        // Absensi
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        const absensi = [
            { id: 1, siswaId: 1, jadwalId: 1, tanggal: today, status: 'hadir', keterangan: '', waktuInput: new Date().toISOString() },
            { id: 2, siswaId: 2, jadwalId: 1, tanggal: today, status: 'hadir', keterangan: '', waktuInput: new Date().toISOString() },
            { id: 3, siswaId: 3, jadwalId: 1, tanggal: today, status: 'izin', keterangan: 'Ada acara keluarga', waktuInput: new Date().toISOString() },
            { id: 4, siswaId: 4, jadwalId: 1, tanggal: today, status: 'sakit', keterangan: 'Demam', waktuInput: new Date().toISOString() },
            { id: 5, siswaId: 5, jadwalId: 1, tanggal: today, status: 'alpa', keterangan: '', waktuInput: new Date().toISOString() },
            { id: 6, siswaId: 1, jadwalId: 4, tanggal: yesterday, status: 'hadir', keterangan: '', waktuInput: new Date().toISOString() },
            { id: 7, siswaId: 2, jadwalId: 4, tanggal: yesterday, status: 'hadir', keterangan: '', waktuInput: new Date().toISOString() },
            { id: 8, siswaId: 3, jadwalId: 4, tanggal: yesterday, status: 'hadir', keterangan: '', waktuInput: new Date().toISOString() },
            { id: 9, siswaId: 4, jadwalId: 4, tanggal: yesterday, status: 'hadir', keterangan: '', waktuInput: new Date().toISOString() },
            { id: 10, siswaId: 5, jadwalId: 4, tanggal: yesterday, status: 'alpa', keterangan: '', waktuInput: new Date().toISOString() },
        ];

        // Log Aktivitas
        const logs = [
            { id: 1, userId: 1, aksi: 'login', deskripsi: 'Admin login ke sistem', waktu: new Date().toISOString() },
            { id: 2, userId: 2, aksi: 'attendance', deskripsi: 'Input absensi kelas X IPA 1', waktu: new Date().toISOString() },
        ];

        // Simpan ke localStorage
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('kelas', JSON.stringify(kelas));
        localStorage.setItem('siswa', JSON.stringify(siswa));
        localStorage.setItem('guru', JSON.stringify(guru));
        localStorage.setItem('mapel', JSON.stringify(mapel));
        localStorage.setItem('jadwal', JSON.stringify(jadwal));
        localStorage.setItem('absensi', JSON.stringify(absensi));
        localStorage.setItem('logs', JSON.stringify(logs));
    },

    // Get data
    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    // Set data
    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Add item
    add(key, item) {
        const data = this.get(key);
        item.id = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
        data.push(item);
        this.set(key, data);
        return item;
    },

    // Update item
    update(key, id, updates) {
        const data = this.get(key);
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updates };
            this.set(key, data);
            return data[index];
        }
        return null;
    },

    // Delete item
    delete(key, id) {
        const data = this.get(key);
        const filtered = data.filter(item => item.id !== id);
        this.set(key, filtered);
        return filtered;
    },

    // Find by id
    findById(key, id) {
        const data = this.get(key);
        return data.find(item => item.id === id);
    },

    // Find by field
    findBy(key, field, value) {
        const data = this.get(key);
        return data.filter(item => item[field] === value);
    },

    // Log activity
    addLog(userId, aksi, deskripsi) {
        const log = {
            userId,
            aksi,
            deskripsi,
            waktu: new Date().toISOString()
        };
        this.add('logs', log);
    },

    // Reset data
    reset() {
        localStorage.clear();
        this.seedData();
        localStorage.setItem('dataInitialized', 'true');
    }
};

// Helper functions
const Helpers = {
    // Format tanggal
    formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    },

    // Format tanggal singkat
    formatDateShort(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    },

    // Format waktu
    formatTime(timeString) {
        return timeString;
    },

    // Get hari ini
    getToday() {
        return new Date().toISOString().split('T')[0];
    },

    // Get nama hari
    getDayName(date) {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return days[new Date(date).getDay()];
    },

    // Get current day name
    getCurrentDayName() {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return days[new Date().getDay()];
    },

    // Format datetime
    formatDateTime(dateString) {
        const date = new Date(dateString);
        return `${this.formatDateShort(dateString)} ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Get status badge class
    getStatusBadge(status) {
        const badges = {
            'hadir': 'badge-success',
            'izin': 'badge-warning',
            'sakit': 'badge-info',
            'alpa': 'badge-danger'
        };
        return badges[status] || 'badge-secondary';
    },

    // Capitalize first letter
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};

// Inisialisasi data saat halaman dimuat
DataStore.init();
