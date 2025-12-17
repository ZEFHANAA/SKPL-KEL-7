// ===== SISWA & ORANG TUA MODULE =====

const SiswaModule = {
    // Load page
    loadPage(page, role) {
        switch (page) {
            case 'dashboard':
                this.renderDashboard(role);
                break;
            case 'riwayat':
                this.renderRiwayat(role);
                break;
            default:
                this.renderDashboard(role);
        }
    },

    // Get siswa data based on role
    getSiswaData(role) {
        const user = Auth.getUser();
        
        if (role === 'siswa') {
            return DataStore.get('siswa').find(s => s.userId === user.id);
        } else if (role === 'ortu') {
            const ortu = DataStore.get('users').find(u => u.id === user.id);
            return DataStore.findById('siswa', ortu.anakId);
        }
        return null;
    },

    // Dashboard
    renderDashboard(role) {
        const user = Auth.getUser();
        const siswaData = this.getSiswaData(role);
        
        if (!siswaData) {
            App.render(`
                <div class="page-header">
                    <h2>Dashboard</h2>
                    <p>Data tidak ditemukan</p>
                </div>
                <div class="card">
                    <div class="card-body">
                        <div class="empty-state">
                            <i class="fas fa-exclamation-triangle"></i>
                            <h3>Data siswa tidak ditemukan</h3>
                            <p>Silakan hubungi administrator</p>
                        </div>
                    </div>
                </div>
            `);
            return;
        }

        const kelas = DataStore.findById('kelas', siswaData.kelasId);
        const absensi = DataStore.findBy('absensi', 'siswaId', siswaData.id);
        
        // Hitung statistik
        const totalAbsensi = absensi.length;
        const hadir = absensi.filter(a => a.status === 'hadir').length;
        const izin = absensi.filter(a => a.status === 'izin').length;
        const sakit = absensi.filter(a => a.status === 'sakit').length;
        const alpa = absensi.filter(a => a.status === 'alpa').length;
        
        const persentaseKehadiran = totalAbsensi > 0 ? ((hadir / totalAbsensi) * 100).toFixed(1) : 0;

        // Absensi terbaru (5 terakhir)
        const recentAbsensi = absensi.slice(-5).reverse();
        const jadwal = DataStore.get('jadwal');
        const mapel = DataStore.get('mapel');

        const html = `
            <div class="page-header">
                <h2>${role === 'siswa' ? 'Dashboard Siswa' : 'Dashboard Orang Tua'}</h2>
                <p>Selamat datang, ${user.name}</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-user"></i> Informasi ${role === 'siswa' ? 'Siswa' : 'Anak'}</h3>
                </div>
                <div class="card-body">
                    <div class="form-row">
                        <div class="form-group">
                            <label>NISN</label>
                            <p style="margin: 0; font-weight: 600;">${siswaData.nisn}</p>
                        </div>
                        <div class="form-group">
                            <label>Nama Lengkap</label>
                            <p style="margin: 0; font-weight: 600;">${siswaData.nama}</p>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Kelas</label>
                            <p style="margin: 0;"><span class="badge badge-info">${kelas?.nama || '-'}</span></p>
                        </div>
                        <div class="form-group">
                            <label>Jenis Kelamin</label>
                            <p style="margin: 0; font-weight: 600;">${siswaData.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="fas fa-clipboard-check"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${totalAbsensi}</h3>
                        <p>Total Kehadiran</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${hadir}</h3>
                        <p>Hadir</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${izin + sakit}</h3>
                        <p>Izin & Sakit</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red">
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${alpa}</h3>
                        <p>Alpa</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-chart-pie"></i> Grafik Kehadiran</h3>
                </div>
                <div class="card-body">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: var(--primary-color); margin-bottom: 5px;">${persentaseKehadiran}%</h2>
                        <p style="color: var(--gray-color);">Persentase Kehadiran</p>
                    </div>
                    <div class="chart-container">
                        <div class="chart-bars">
                            <div class="chart-bar" style="height: ${totalAbsensi > 0 ? (hadir/totalAbsensi)*100 : 0}%;" data-value="${hadir}">
                                <span>Hadir</span>
                            </div>
                            <div class="chart-bar" style="height: ${totalAbsensi > 0 ? (izin/totalAbsensi)*100 : 0}%;" data-value="${izin}">
                                <span>Izin</span>
                            </div>
                            <div class="chart-bar" style="height: ${totalAbsensi > 0 ? (sakit/totalAbsensi)*100 : 0}%;" data-value="${sakit}">
                                <span>Sakit</span>
                            </div>
                            <div class="chart-bar" style="height: ${totalAbsensi > 0 ? (alpa/totalAbsensi)*100 : 0}%;" data-value="${alpa}">
                                <span>Alpa</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-history"></i> Absensi Terbaru</h3>
                </div>
                <div class="card-body">
                    ${recentAbsensi.length === 0 ? `
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <h3>Belum ada data absensi</h3>
                            <p>Absensi akan muncul setelah guru menginput kehadiran</p>
                        </div>
                    ` : `
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tanggal</th>
                                        <th>Mata Pelajaran</th>
                                        <th>Status</th>
                                        <th>Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${recentAbsensi.map(a => {
                                        const jadwalData = jadwal.find(j => j.id === a.jadwalId);
                                        const mapelData = mapel.find(m => m.id === jadwalData?.mapelId);
                                        return `
                                        <tr>
                                            <td>${Helpers.formatDateShort(a.tanggal)}</td>
                                            <td>${mapelData?.nama || '-'}</td>
                                            <td><span class="badge ${Helpers.getStatusBadge(a.status)}">${Helpers.capitalize(a.status)}</span></td>
                                            <td>${a.keterangan || '-'}</td>
                                        </tr>
                                    `}).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>
            </div>
        `;

        App.render(html);
    },

    // Riwayat Absensi
    renderRiwayat(role) {
        const user = Auth.getUser();
        const siswaData = this.getSiswaData(role);
        
        if (!siswaData) {
            App.render(`
                <div class="page-header">
                    <h2>Riwayat Absensi</h2>
                    <p>Data tidak ditemukan</p>
                </div>
                <div class="card">
                    <div class="card-body">
                        <div class="empty-state">
                            <i class="fas fa-exclamation-triangle"></i>
                            <h3>Data siswa tidak ditemukan</h3>
                            <p>Silakan hubungi administrator</p>
                        </div>
                    </div>
                </div>
            `);
            return;
        }

        const kelas = DataStore.findById('kelas', siswaData.kelasId);
        const absensi = DataStore.findBy('absensi', 'siswaId', siswaData.id);
        const jadwal = DataStore.get('jadwal');
        const mapel = DataStore.get('mapel');

        // Get bulan untuk filter
        const months = [...new Set(absensi.map(a => a.tanggal.substring(0, 7)))].sort().reverse();
        const currentMonth = new Date().toISOString().substring(0, 7);

        const html = `
            <div class="page-header">
                <h2>Riwayat Absensi</h2>
                <p>${siswaData.nama} - ${kelas?.nama || '-'}</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-history"></i> Riwayat Kehadiran</h3>
                </div>
                <div class="card-body">
                    <div class="filter-bar">
                        <select id="filterBulan" class="filter-select" onchange="SiswaModule.filterByMonth()">
                            <option value="">Semua Bulan</option>
                            ${months.map(m => `<option value="${m}" ${m === currentMonth ? 'selected' : ''}>${this.formatMonth(m)}</option>`).join('')}
                        </select>
                        <select id="filterStatus" class="filter-select" onchange="SiswaModule.filterByMonth()">
                            <option value="">Semua Status</option>
                            <option value="hadir">Hadir</option>
                            <option value="izin">Izin</option>
                            <option value="sakit">Sakit</option>
                            <option value="alpa">Alpa</option>
                        </select>
                    </div>

                    <div id="riwayatSiswaContent">
                        ${this.generateRiwayatSiswaTable(absensi, currentMonth, null, jadwal, mapel)}
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-calendar-alt"></i> Rekap Bulanan</h3>
                </div>
                <div class="card-body">
                    ${this.generateRekapBulanan(absensi)}
                </div>
            </div>
        `;

        App.render(html);
    },

    generateRiwayatSiswaTable(absensi, bulan, status, jadwal, mapel) {
        let filtered = absensi;

        if (bulan) {
            filtered = filtered.filter(a => a.tanggal.startsWith(bulan));
        }

        if (status) {
            filtered = filtered.filter(a => a.status === status);
        }

        filtered = filtered.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

        if (filtered.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>Tidak ada data</h3>
                    <p>Belum ada riwayat absensi untuk filter yang dipilih</p>
                </div>
            `;
        }

        // Summary untuk periode yang dipilih
        const hadir = filtered.filter(a => a.status === 'hadir').length;
        const izin = filtered.filter(a => a.status === 'izin').length;
        const sakit = filtered.filter(a => a.status === 'sakit').length;
        const alpa = filtered.filter(a => a.status === 'alpa').length;

        return `
            <div class="summary-grid" style="margin-bottom: 20px;">
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
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Tanggal</th>
                            <th>Hari</th>
                            <th>Mata Pelajaran</th>
                            <th>Status</th>
                            <th>Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filtered.map((a, index) => {
                            const jadwalData = jadwal.find(j => j.id === a.jadwalId);
                            const mapelData = mapel.find(m => m.id === jadwalData?.mapelId);
                            return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${Helpers.formatDateShort(a.tanggal)}</td>
                                <td>${Helpers.getDayName(a.tanggal)}</td>
                                <td>${mapelData?.nama || '-'}</td>
                                <td><span class="badge ${Helpers.getStatusBadge(a.status)}">${Helpers.capitalize(a.status)}</span></td>
                                <td>${a.keterangan || '-'}</td>
                            </tr>
                        `}).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    generateRekapBulanan(absensi) {
        // Group by month
        const byMonth = {};
        absensi.forEach(a => {
            const month = a.tanggal.substring(0, 7);
            if (!byMonth[month]) {
                byMonth[month] = { hadir: 0, izin: 0, sakit: 0, alpa: 0, total: 0 };
            }
            byMonth[month][a.status]++;
            byMonth[month].total++;
        });

        const months = Object.keys(byMonth).sort().reverse();

        if (months.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>Belum ada data</h3>
                    <p>Belum ada rekap absensi bulanan</p>
                </div>
            `;
        }

        return `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Bulan</th>
                            <th>Hadir</th>
                            <th>Izin</th>
                            <th>Sakit</th>
                            <th>Alpa</th>
                            <th>Total</th>
                            <th>Persentase</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${months.map(month => {
                            const data = byMonth[month];
                            const persentase = ((data.hadir / data.total) * 100).toFixed(1);
                            return `
                            <tr>
                                <td><strong>${this.formatMonth(month)}</strong></td>
                                <td><span class="badge badge-success">${data.hadir}</span></td>
                                <td><span class="badge badge-warning">${data.izin}</span></td>
                                <td><span class="badge badge-info">${data.sakit}</span></td>
                                <td><span class="badge badge-danger">${data.alpa}</span></td>
                                <td><strong>${data.total}</strong></td>
                                <td>
                                    <strong style="color: ${persentase >= 75 ? 'var(--success-color)' : persentase >= 50 ? 'var(--warning-color)' : 'var(--danger-color)'}">
                                        ${persentase}%
                                    </strong>
                                </td>
                            </tr>
                        `}).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    filterByMonth() {
        const role = Auth.getUser().role;
        const siswaData = this.getSiswaData(role);
        const absensi = DataStore.findBy('absensi', 'siswaId', siswaData.id);
        const jadwal = DataStore.get('jadwal');
        const mapel = DataStore.get('mapel');
        
        const bulan = document.getElementById('filterBulan').value;
        const status = document.getElementById('filterStatus').value;
        
        document.getElementById('riwayatSiswaContent').innerHTML = 
            this.generateRiwayatSiswaTable(absensi, bulan, status, jadwal, mapel);
    },

    formatMonth(monthString) {
        const [year, month] = monthString.split('-');
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return `${months[parseInt(month) - 1]} ${year}`;
    }
};
