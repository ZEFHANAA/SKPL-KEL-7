// ===== ADMIN MODULE =====

const AdminModule = {
    // Load page
    loadPage(page) {
        switch (page) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'users':
                this.renderUsers();
                break;
            case 'siswa':
                this.renderSiswa();
                break;
            case 'guru':
                this.renderGuru();
                break;
            case 'kelas':
                this.renderKelas();
                break;
            case 'mapel':
                this.renderMapel();
                break;
            case 'jadwal':
                this.renderJadwal();
                break;
            case 'rekap':
                this.renderRekap();
                break;
            case 'laporan':
                this.renderLaporan();
                break;
            case 'log':
                this.renderLog();
                break;
            default:
                this.renderDashboard();
        }
    },

    // Dashboard Admin
    renderDashboard() {
        const siswa = DataStore.get('siswa');
        const guru = DataStore.get('guru');
        const kelas = DataStore.get('kelas');
        const absensi = DataStore.get('absensi');
        const today = Helpers.getToday();
        const todayAbsensi = absensi.filter(a => a.tanggal === today);

        const hadir = todayAbsensi.filter(a => a.status === 'hadir').length;
        const izin = todayAbsensi.filter(a => a.status === 'izin').length;
        const sakit = todayAbsensi.filter(a => a.status === 'sakit').length;
        const alpa = todayAbsensi.filter(a => a.status === 'alpa').length;

        const html = `
            <div class="page-header">
                <h2>Dashboard Admin</h2>
                <p>Selamat datang di Sistem Absensi Siswa</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${siswa.length}</h3>
                        <p>Total Siswa</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${guru.length}</h3>
                        <p>Total Guru</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="fas fa-school"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${kelas.length}</h3>
                        <p>Total Kelas</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">
                        <i class="fas fa-clipboard-check"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${todayAbsensi.length}</h3>
                        <p>Absensi Hari Ini</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-chart-pie"></i> Rekap Absensi Hari Ini</h3>
                </div>
                <div class="card-body">
                    <div class="summary-grid">
                        <div class="summary-box hadir">
                            <h4>${hadir}</h4>
                            <p>Hadir</p>
                        </div>
                        <div class="summary-box izin">
                            <h4>${izin}</h4>
                            <p>Izin</p>
                        </div>
                        <div class="summary-box sakit">
                            <h4>${sakit}</h4>
                            <p>Sakit</p>
                        </div>
                        <div class="summary-box alpa">
                            <h4>${alpa}</h4>
                            <p>Alpa</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        App.render(html);
    },

    // Manajemen Pengguna
    renderUsers() {
        const users = DataStore.get('users');
        const guru = DataStore.get('guru');

        const html = `
            <div class="page-header">
                <h2>Manajemen Pengguna</h2>
                <p>Kelola akun guru dan admin</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-users-cog"></i> Daftar Pengguna</h3>
                    <button class="btn btn-primary" onclick="AdminModule.showAddUserModal()">
                        <i class="fas fa-plus"></i> Tambah Pengguna
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Username</th>
                                    <th>Nama</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map((user, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${user.username}</td>
                                        <td>${user.name}</td>
                                        <td>${user.email}</td>
                                        <td><span class="badge badge-primary">${Auth.getRoleDisplayName(user.role)}</span></td>
                                        <td>
                                            <div class="btn-group">
                                                <button class="btn btn-sm btn-warning" onclick="AdminModule.showEditUserModal(${user.id})">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="btn btn-sm btn-secondary" onclick="AdminModule.resetPasswordUser(${user.id})">
                                                    <i class="fas fa-key"></i>
                                                </button>
                                                ${user.role !== 'admin' ? `
                                                <button class="btn btn-sm btn-danger" onclick="AdminModule.deleteUser(${user.id})">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                                ` : ''}
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        App.render(html);
    },

    showAddUserModal() {
        const content = `
            <form id="formUser">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" name="username" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" required>
                </div>
                <div class="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required>
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <select name="role" required>
                        <option value="">Pilih Role</option>
                        <option value="admin">Admin</option>
                        <option value="guru">Guru</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
        `;

        App.openModal('Tambah Pengguna', content);

        document.getElementById('formUser').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            DataStore.add('users', data);
            DataStore.addLog(Auth.getUser().id, 'add', `Tambah user: ${data.name}`);
            App.closeModal();
            App.showNotification('Pengguna berhasil ditambahkan!', 'success');
            this.renderUsers();
        });
    },

    resetPasswordUser(id) {
        App.confirm('Reset password ke default (123456)?', () => {
            Auth.resetPassword(id);
            App.showNotification('Password berhasil direset!', 'success');
        });
    },

    deleteUser(id) {
        App.confirm('Yakin ingin menghapus pengguna ini?', () => {
            DataStore.delete('users', id);
            DataStore.addLog(Auth.getUser().id, 'delete', `Hapus user ID: ${id}`);
            App.showNotification('Pengguna berhasil dihapus!', 'success');
            this.renderUsers();
        });
    },

    // Data Siswa
    renderSiswa() {
        const siswa = DataStore.get('siswa');
        const kelas = DataStore.get('kelas');

        const html = `
            <div class="page-header">
                <h2>Data Siswa</h2>
                <p>Kelola data siswa</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-user-graduate"></i> Daftar Siswa</h3>
                    <button class="btn btn-primary" onclick="AdminModule.showAddSiswaModal()">
                        <i class="fas fa-plus"></i> Tambah Siswa
                    </button>
                </div>
                <div class="card-body">
                    <div class="filter-bar">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="searchSiswa" placeholder="Cari siswa..." onkeyup="AdminModule.filterSiswa()">
                        </div>
                        <select id="filterKelas" class="filter-select" onchange="AdminModule.filterSiswa()">
                            <option value="">Semua Kelas</option>
                            ${kelas.map(k => `<option value="${k.id}">${k.nama}</option>`).join('')}
                        </select>
                    </div>
                    <div class="table-container">
                        <table id="tableSiswa">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>NISN</th>
                                    <th>Nama</th>
                                    <th>Kelas</th>
                                    <th>JK</th>
                                    <th>No. Telp</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${siswa.map((s, index) => {
                                    const kelasData = kelas.find(k => k.id === s.kelasId);
                                    return `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${s.nisn}</td>
                                        <td>${s.nama}</td>
                                        <td><span class="badge badge-info">${kelasData?.nama || '-'}</span></td>
                                        <td>${s.jenisKelamin}</td>
                                        <td>${s.noTelp}</td>
                                        <td>
                                            <div class="btn-group">
                                                <button class="btn btn-sm btn-warning" onclick="AdminModule.showEditSiswaModal(${s.id})">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="btn btn-sm btn-danger" onclick="AdminModule.deleteSiswa(${s.id})">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `}).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        App.render(html);
    },

    filterSiswa() {
        const search = document.getElementById('searchSiswa').value.toLowerCase();
        const kelasFilter = document.getElementById('filterKelas').value;
        const rows = document.querySelectorAll('#tableSiswa tbody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const kelasId = row.cells[3].textContent;
            const matchSearch = text.includes(search);
            const matchKelas = !kelasFilter || row.dataset.kelasId === kelasFilter;
            
            row.style.display = matchSearch && matchKelas ? '' : 'none';
        });
    },

    showAddSiswaModal() {
        const kelas = DataStore.get('kelas');
        const content = `
            <form id="formSiswa">
                <div class="form-row">
                    <div class="form-group">
                        <label>NISN</label>
                        <input type="text" name="nisn" required>
                    </div>
                    <div class="form-group">
                        <label>Nama Lengkap</label>
                        <input type="text" name="nama" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Kelas</label>
                        <select name="kelasId" required>
                            <option value="">Pilih Kelas</option>
                            ${kelas.map(k => `<option value="${k.id}">${k.nama}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Jenis Kelamin</label>
                        <select name="jenisKelamin" required>
                            <option value="">Pilih</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tempat Lahir</label>
                        <input type="text" name="tempatLahir" required>
                    </div>
                    <div class="form-group">
                        <label>Tanggal Lahir</label>
                        <input type="date" name="tanggalLahir" required>
                    </div>
                </div>
                <div class="form-row single">
                    <div class="form-group">
                        <label>Alamat</label>
                        <textarea name="alamat" rows="2" required></textarea>
                    </div>
                </div>
                <div class="form-row single">
                    <div class="form-group">
                        <label>No. Telepon</label>
                        <input type="tel" name="noTelp" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
        `;

        App.openModal('Tambah Siswa', content);

        document.getElementById('formSiswa').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            data.kelasId = parseInt(data.kelasId);
            data.userId = null;
            
            DataStore.add('siswa', data);
            DataStore.addLog(Auth.getUser().id, 'add', `Tambah siswa: ${data.nama}`);
            App.closeModal();
            App.showNotification('Siswa berhasil ditambahkan!', 'success');
            this.renderSiswa();
        });
    },

    deleteSiswa(id) {
        App.confirm('Yakin ingin menghapus siswa ini?', () => {
            DataStore.delete('siswa', id);
            DataStore.addLog(Auth.getUser().id, 'delete', `Hapus siswa ID: ${id}`);
            App.showNotification('Siswa berhasil dihapus!', 'success');
            this.renderSiswa();
        });
    },

    // Data Guru
    renderGuru() {
        const guru = DataStore.get('guru');
        const mapel = DataStore.get('mapel');

        const html = `
            <div class="page-header">
                <h2>Data Guru</h2>
                <p>Kelola data guru</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-chalkboard-teacher"></i> Daftar Guru</h3>
                    <button class="btn btn-primary" onclick="AdminModule.showAddGuruModal()">
                        <i class="fas fa-plus"></i> Tambah Guru
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>NIP</th>
                                    <th>Nama</th>
                                    <th>JK</th>
                                    <th>Email</th>
                                    <th>No. Telp</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${guru.map((g, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${g.nip}</td>
                                        <td>${g.nama}</td>
                                        <td>${g.jenisKelamin}</td>
                                        <td>${g.email}</td>
                                        <td>${g.noTelp}</td>
                                        <td>
                                            <div class="btn-group">
                                                <button class="btn btn-sm btn-warning" onclick="AdminModule.showEditGuruModal(${g.id})">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="btn btn-sm btn-danger" onclick="AdminModule.deleteGuru(${g.id})">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        App.render(html);
    },

    showAddGuruModal() {
        const mapel = DataStore.get('mapel');
        const content = `
            <form id="formGuru">
                <div class="form-row">
                    <div class="form-group">
                        <label>NIP</label>
                        <input type="text" name="nip" required>
                    </div>
                    <div class="form-group">
                        <label>Nama Lengkap</label>
                        <input type="text" name="nama" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Jenis Kelamin</label>
                        <select name="jenisKelamin" required>
                            <option value="">Pilih</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tempat Lahir</label>
                        <input type="text" name="tempatLahir" required>
                    </div>
                    <div class="form-group">
                        <label>Tanggal Lahir</label>
                        <input type="date" name="tanggalLahir" required>
                    </div>
                </div>
                <div class="form-row single">
                    <div class="form-group">
                        <label>Alamat</label>
                        <textarea name="alamat" rows="2" required></textarea>
                    </div>
                </div>
                <div class="form-row single">
                    <div class="form-group">
                        <label>No. Telepon</label>
                        <input type="tel" name="noTelp" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
        `;

        App.openModal('Tambah Guru', content);

        document.getElementById('formGuru').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            data.mapelId = [];
            data.userId = null;
            
            DataStore.add('guru', data);
            DataStore.addLog(Auth.getUser().id, 'add', `Tambah guru: ${data.nama}`);
            App.closeModal();
            App.showNotification('Guru berhasil ditambahkan!', 'success');
            this.renderGuru();
        });
    },

    deleteGuru(id) {
        App.confirm('Yakin ingin menghapus guru ini?', () => {
            DataStore.delete('guru', id);
            DataStore.addLog(Auth.getUser().id, 'delete', `Hapus guru ID: ${id}`);
            App.showNotification('Guru berhasil dihapus!', 'success');
            this.renderGuru();
        });
    },

    // Data Kelas
    renderKelas() {
        const kelas = DataStore.get('kelas');
        const guru = DataStore.get('guru');
        const siswa = DataStore.get('siswa');

        const html = `
            <div class="page-header">
                <h2>Data Kelas</h2>
                <p>Kelola data kelas</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-school"></i> Daftar Kelas</h3>
                    <button class="btn btn-primary" onclick="AdminModule.showAddKelasModal()">
                        <i class="fas fa-plus"></i> Tambah Kelas
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama Kelas</th>
                                    <th>Tingkat</th>
                                    <th>Jurusan</th>
                                    <th>Wali Kelas</th>
                                    <th>Jumlah Siswa</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${kelas.map((k, index) => {
                                    const waliKelas = guru.find(g => g.id === k.waliKelasId);
                                    const jumlahSiswa = siswa.filter(s => s.kelasId === k.id).length;
                                    return `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${k.nama}</td>
                                        <td><span class="badge badge-primary">${k.tingkat}</span></td>
                                        <td>${k.jurusan}</td>
                                        <td>${waliKelas?.nama || '-'}</td>
                                        <td>${jumlahSiswa} siswa</td>
                                        <td>
                                            <div class="btn-group">
                                                <button class="btn btn-sm btn-warning" onclick="AdminModule.showEditKelasModal(${k.id})">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="btn btn-sm btn-danger" onclick="AdminModule.deleteKelas(${k.id})">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `}).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        App.render(html);
    },

    showAddKelasModal() {
        const guru = DataStore.get('guru');
        const content = `
            <form id="formKelas">
                <div class="form-group">
                    <label>Nama Kelas</label>
                    <input type="text" name="nama" placeholder="Contoh: X IPA 1" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tingkat</label>
                        <select name="tingkat" required>
                            <option value="">Pilih Tingkat</option>
                            <option value="X">X</option>
                            <option value="XI">XI</option>
                            <option value="XII">XII</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Jurusan</label>
                        <select name="jurusan" required>
                            <option value="">Pilih Jurusan</option>
                            <option value="IPA">IPA</option>
                            <option value="IPS">IPS</option>
                            <option value="Bahasa">Bahasa</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Wali Kelas</label>
                    <select name="waliKelasId" required>
                        <option value="">Pilih Guru</option>
                        ${guru.map(g => `<option value="${g.id}">${g.nama}</option>`).join('')}
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
        `;

        App.openModal('Tambah Kelas', content);

        document.getElementById('formKelas').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            data.waliKelasId = parseInt(data.waliKelasId);
            
            DataStore.add('kelas', data);
            DataStore.addLog(Auth.getUser().id, 'add', `Tambah kelas: ${data.nama}`);
            App.closeModal();
            App.showNotification('Kelas berhasil ditambahkan!', 'success');
            this.renderKelas();
        });
    },

    deleteKelas(id) {
        App.confirm('Yakin ingin menghapus kelas ini?', () => {
            DataStore.delete('kelas', id);
            DataStore.addLog(Auth.getUser().id, 'delete', `Hapus kelas ID: ${id}`);
            App.showNotification('Kelas berhasil dihapus!', 'success');
            this.renderKelas();
        });
    },

    // Mata Pelajaran
    renderMapel() {
        const mapel = DataStore.get('mapel');

        const html = `
            <div class="page-header">
                <h2>Mata Pelajaran</h2>
                <p>Kelola mata pelajaran</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-book"></i> Daftar Mata Pelajaran</h3>
                    <button class="btn btn-primary" onclick="AdminModule.showAddMapelModal()">
                        <i class="fas fa-plus"></i> Tambah Mapel
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Kode</th>
                                    <th>Nama Mata Pelajaran</th>
                                    <th>Deskripsi</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${mapel.map((m, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td><span class="badge badge-primary">${m.kode}</span></td>
                                        <td>${m.nama}</td>
                                        <td>${m.deskripsi}</td>
                                        <td>
                                            <div class="btn-group">
                                                <button class="btn btn-sm btn-warning" onclick="AdminModule.showEditMapelModal(${m.id})">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="btn btn-sm btn-danger" onclick="AdminModule.deleteMapel(${m.id})">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        App.render(html);
    },

    showAddMapelModal() {
        const content = `
            <form id="formMapel">
                <div class="form-group">
                    <label>Kode Mapel</label>
                    <input type="text" name="kode" placeholder="Contoh: MTK" required>
                </div>
                <div class="form-group">
                    <label>Nama Mata Pelajaran</label>
                    <input type="text" name="nama" placeholder="Contoh: Matematika" required>
                </div>
                <div class="form-group">
                    <label>Deskripsi</label>
                    <textarea name="deskripsi" rows="3" required></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
        `;

        App.openModal('Tambah Mata Pelajaran', content);

        document.getElementById('formMapel').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            DataStore.add('mapel', data);
            DataStore.addLog(Auth.getUser().id, 'add', `Tambah mapel: ${data.nama}`);
            App.closeModal();
            App.showNotification('Mata pelajaran berhasil ditambahkan!', 'success');
            this.renderMapel();
        });
    },

    deleteMapel(id) {
        App.confirm('Yakin ingin menghapus mata pelajaran ini?', () => {
            DataStore.delete('mapel', id);
            DataStore.addLog(Auth.getUser().id, 'delete', `Hapus mapel ID: ${id}`);
            App.showNotification('Mata pelajaran berhasil dihapus!', 'success');
            this.renderMapel();
        });
    },

    // Jadwal Pelajaran
    renderJadwal() {
        const jadwal = DataStore.get('jadwal');
        const kelas = DataStore.get('kelas');
        const mapel = DataStore.get('mapel');
        const guru = DataStore.get('guru');

        const html = `
            <div class="page-header">
                <h2>Jadwal Pelajaran</h2>
                <p>Kelola jadwal pelajaran</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-calendar-alt"></i> Daftar Jadwal</h3>
                    <button class="btn btn-primary" onclick="AdminModule.showAddJadwalModal()">
                        <i class="fas fa-plus"></i> Tambah Jadwal
                    </button>
                </div>
                <div class="card-body">
                    <div class="filter-bar">
                        <select id="filterKelasJadwal" class="filter-select" onchange="AdminModule.filterJadwal()">
                            <option value="">Semua Kelas</option>
                            ${kelas.map(k => `<option value="${k.id}">${k.nama}</option>`).join('')}
                        </select>
                    </div>
                    <div class="table-container">
                        <table id="tableJadwal">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Kelas</th>
                                    <th>Hari</th>
                                    <th>Jam</th>
                                    <th>Mata Pelajaran</th>
                                    <th>Guru</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${jadwal.map((j, index) => {
                                    const kelasData = kelas.find(k => k.id === j.kelasId);
                                    const mapelData = mapel.find(m => m.id === j.mapelId);
                                    const guruData = guru.find(g => g.id === j.guruId);
                                    return `
                                    <tr data-kelas-id="${j.kelasId}">
                                        <td>${index + 1}</td>
                                        <td><span class="badge badge-info">${kelasData?.nama || '-'}</span></td>
                                        <td>${j.hari}</td>
                                        <td>${j.jamMulai} - ${j.jamSelesai}</td>
                                        <td>${mapelData?.nama || '-'}</td>
                                        <td>${guruData?.nama || '-'}</td>
                                        <td>
                                            <div class="btn-group">
                                                <button class="btn btn-sm btn-warning" onclick="AdminModule.showEditJadwalModal(${j.id})">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="btn btn-sm btn-danger" onclick="AdminModule.deleteJadwal(${j.id})">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `}).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        App.render(html);
    },

    filterJadwal() {
        const kelasFilter = document.getElementById('filterKelasJadwal').value;
        const rows = document.querySelectorAll('#tableJadwal tbody tr');

        rows.forEach(row => {
            const matchKelas = !kelasFilter || row.dataset.kelasId === kelasFilter;
            row.style.display = matchKelas ? '' : 'none';
        });
    },

    showAddJadwalModal() {
        const kelas = DataStore.get('kelas');
        const mapel = DataStore.get('mapel');
        const guru = DataStore.get('guru');

        const content = `
            <form id="formJadwal">
                <div class="form-group">
                    <label>Kelas</label>
                    <select name="kelasId" required>
                        <option value="">Pilih Kelas</option>
                        ${kelas.map(k => `<option value="${k.id}">${k.nama}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Mata Pelajaran</label>
                        <select name="mapelId" required>
                            <option value="">Pilih Mapel</option>
                            ${mapel.map(m => `<option value="${m.id}">${m.nama}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Guru</label>
                        <select name="guruId" required>
                            <option value="">Pilih Guru</option>
                            ${guru.map(g => `<option value="${g.id}">${g.nama}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Hari</label>
                    <select name="hari" required>
                        <option value="">Pilih Hari</option>
                        <option value="Senin">Senin</option>
                        <option value="Selasa">Selasa</option>
                        <option value="Rabu">Rabu</option>
                        <option value="Kamis">Kamis</option>
                        <option value="Jumat">Jumat</option>
                        <option value="Sabtu">Sabtu</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Jam Mulai</label>
                        <input type="time" name="jamMulai" required>
                    </div>
                    <div class="form-group">
                        <label>Jam Selesai</label>
                        <input type="time" name="jamSelesai" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
        `;

        App.openModal('Tambah Jadwal', content);

        document.getElementById('formJadwal').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            data.kelasId = parseInt(data.kelasId);
            data.mapelId = parseInt(data.mapelId);
            data.guruId = parseInt(data.guruId);
            
            DataStore.add('jadwal', data);
            DataStore.addLog(Auth.getUser().id, 'add', `Tambah jadwal pelajaran`);
            App.closeModal();
            App.showNotification('Jadwal berhasil ditambahkan!', 'success');
            this.renderJadwal();
        });
    },

    deleteJadwal(id) {
        App.confirm('Yakin ingin menghapus jadwal ini?', () => {
            DataStore.delete('jadwal', id);
            DataStore.addLog(Auth.getUser().id, 'delete', `Hapus jadwal ID: ${id}`);
            App.showNotification('Jadwal berhasil dihapus!', 'success');
            this.renderJadwal();
        });
    },

    // Rekap Absensi
    renderRekap() {
        const absensi = DataStore.get('absensi');
        const siswa = DataStore.get('siswa');
        const kelas = DataStore.get('kelas');
        const today = Helpers.getToday();

        const html = `
            <div class="page-header">
                <h2>Rekap & Validasi Absensi</h2>
                <p>Lihat dan validasi data absensi</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-clipboard-check"></i> Rekap Absensi</h3>
                </div>
                <div class="card-body">
                    <div class="filter-bar">
                        <input type="date" id="filterTanggal" class="filter-select" value="${today}" onchange="AdminModule.filterRekap()">
                        <select id="filterKelasRekap" class="filter-select" onchange="AdminModule.filterRekap()">
                            <option value="">Semua Kelas</option>
                            ${kelas.map(k => `<option value="${k.id}">${k.nama}</option>`).join('')}
                        </select>
                        <button class="btn btn-success" onclick="AdminModule.exportRekap()">
                            <i class="fas fa-file-excel"></i> Export Excel
                        </button>
                    </div>
                    <div id="rekapContent">
                        ${this.generateRekapTable(today, null)}
                    </div>
                </div>
            </div>
        `;

        App.render(html);
    },

    generateRekapTable(tanggal, kelasId) {
        const absensi = DataStore.get('absensi').filter(a => a.tanggal === tanggal);
        const siswa = DataStore.get('siswa');
        const kelas = DataStore.get('kelas');
        const jadwal = DataStore.get('jadwal');
        const mapel = DataStore.get('mapel');

        let filteredAbsensi = absensi;
        if (kelasId) {
            const siswaInKelas = siswa.filter(s => s.kelasId === parseInt(kelasId));
            const siswaIds = siswaInKelas.map(s => s.id);
            filteredAbsensi = absensi.filter(a => siswaIds.includes(a.siswaId));
        }

        if (filteredAbsensi.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>Tidak ada data absensi</h3>
                    <p>Belum ada data absensi untuk filter yang dipilih</p>
                </div>
            `;
        }

        return `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Siswa</th>
                            <th>Kelas</th>
                            <th>Mata Pelajaran</th>
                            <th>Status</th>
                            <th>Keterangan</th>
                            <th>Waktu Input</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredAbsensi.map((a, index) => {
                            const siswaData = siswa.find(s => s.id === a.siswaId);
                            const kelasData = kelas.find(k => k.id === siswaData?.kelasId);
                            const jadwalData = jadwal.find(j => j.id === a.jadwalId);
                            const mapelData = mapel.find(m => m.id === jadwalData?.mapelId);
                            return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${siswaData?.nama || '-'}</td>
                                <td><span class="badge badge-info">${kelasData?.nama || '-'}</span></td>
                                <td>${mapelData?.nama || '-'}</td>
                                <td><span class="badge ${Helpers.getStatusBadge(a.status)}">${Helpers.capitalize(a.status)}</span></td>
                                <td>${a.keterangan || '-'}</td>
                                <td>${Helpers.formatDateTime(a.waktuInput)}</td>
                            </tr>
                        `}).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    filterRekap() {
        const tanggal = document.getElementById('filterTanggal').value;
        const kelasId = document.getElementById('filterKelasRekap').value;
        document.getElementById('rekapContent').innerHTML = this.generateRekapTable(tanggal, kelasId);
    },

    exportRekap() {
        App.showNotification('Fitur export akan tersedia di versi berikutnya', 'info');
    },

    // Laporan
    renderLaporan() {
        const html = `
            <div class="page-header">
                <h2>Laporan</h2>
                <p>Generate laporan absensi</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-chart-bar"></i> Generate Laporan</h3>
                </div>
                <div class="card-body">
                    <div class="tab-nav">
                        <button class="tab-btn active" data-tab="persiswa">Per Siswa</button>
                        <button class="tab-btn" data-tab="perkelas">Per Kelas</button>
                        <button class="tab-btn" data-tab="periode">Per Periode</button>
                    </div>
                    
                    <div class="tab-content active" id="persiswa">
                        <h4>Laporan Per Siswa</h4>
                        <p>Generate laporan absensi individual siswa</p>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Pilih Siswa</label>
                                <select id="laporanSiswa" class="filter-select">
                                    <option value="">Pilih Siswa</option>
                                    ${DataStore.get('siswa').map(s => `<option value="${s.id}">${s.nama}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="AdminModule.generateLaporanSiswa()">
                            <i class="fas fa-file-pdf"></i> Generate Laporan
                        </button>
                    </div>
                    
                    <div class="tab-content" id="perkelas">
                        <h4>Laporan Per Kelas</h4>
                        <p>Generate laporan absensi kelas</p>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Pilih Kelas</label>
                                <select id="laporanKelas" class="filter-select">
                                    <option value="">Pilih Kelas</option>
                                    ${DataStore.get('kelas').map(k => `<option value="${k.id}">${k.nama}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="AdminModule.generateLaporanKelas()">
                            <i class="fas fa-file-pdf"></i> Generate Laporan
                        </button>
                    </div>
                    
                    <div class="tab-content" id="periode">
                        <h4>Laporan Per Periode</h4>
                        <p>Generate laporan berdasarkan periode waktu</p>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Tanggal Mulai</label>
                                <input type="date" id="periodeStart" class="filter-select">
                            </div>
                            <div class="form-group">
                                <label>Tanggal Selesai</label>
                                <input type="date" id="periodeEnd" class="filter-select">
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="AdminModule.generateLaporanPeriode()">
                            <i class="fas fa-file-pdf"></i> Generate Laporan
                        </button>
                    </div>
                </div>
            </div>
        `;

        App.render(html);

        // Setup tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.add('active');
            });
        });
    },

    generateLaporanSiswa() {
        App.showNotification('Laporan per siswa akan di-generate', 'info');
    },

    generateLaporanKelas() {
        App.showNotification('Laporan per kelas akan di-generate', 'info');
    },

    generateLaporanPeriode() {
        App.showNotification('Laporan per periode akan di-generate', 'info');
    },

    // Log Aktivitas
    renderLog() {
        const logs = DataStore.get('logs');
        const users = DataStore.get('users');

        const html = `
            <div class="page-header">
                <h2>Log Aktivitas</h2>
                <p>Riwayat aktivitas sistem</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-history"></i> Log Aktivitas</h3>
                </div>
                <div class="card-body">
                    ${logs.length === 0 ? `
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <h3>Belum ada log aktivitas</h3>
                        </div>
                    ` : logs.reverse().map(log => {
                        const user = users.find(u => u.id === log.userId);
                        const iconClass = {
                            'login': 'login',
                            'logout': 'delete',
                            'attendance': 'attendance',
                            'add': 'attendance',
                            'edit': 'edit',
                            'delete': 'delete'
                        }[log.aksi] || 'attendance';

                        return `
                            <div class="log-item">
                                <div class="log-icon ${iconClass}">
                                    <i class="fas fa-${log.aksi === 'login' ? 'sign-in-alt' : log.aksi === 'logout' ? 'sign-out-alt' : log.aksi === 'attendance' || log.aksi === 'add' ? 'clipboard-check' : log.aksi === 'edit' ? 'edit' : 'trash'}"></i>
                                </div>
                                <div class="log-content">
                                    <h4>${log.deskripsi}</h4>
                                    <p>${user?.name || 'System'} • ${Helpers.formatDateTime(log.waktu)}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        App.render(html);
    }
};
