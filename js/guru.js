// ===== GURU MODULE =====

const GuruModule = {
    // Load page
    loadPage(page) {
        switch (page) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'absensi':
                this.renderAbsensi();
                break;
            case 'riwayat':
                this.renderRiwayat();
                break;
            default:
                this.renderDashboard();
        }
    },

    // Dashboard Guru
    renderDashboard() {
        const user = Auth.getUser();
        const guru = DataStore.get('guru').find(g => g.userId === user.id);
        const jadwal = DataStore.get('jadwal').filter(j => j.guruId === guru?.id);
        const currentDay = Helpers.getCurrentDayName();
        const todaySchedule = jadwal.filter(j => j.hari === currentDay);
        const kelas = DataStore.get('kelas');
        const mapel = DataStore.get('mapel');

        const html = `
            <div class="page-header">
                <h2>Dashboard Guru</h2>
                <p>Selamat datang, ${user.name}</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${todaySchedule.length}</h3>
                        <p>Jadwal Hari Ini</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${jadwal.length}</h3>
                        <p>Total Jadwal Mengajar</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="fas fa-clipboard-list"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${Helpers.getToday()}</h3>
                        <p>Hari Ini (${currentDay})</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-calendar-day"></i> Jadwal Mengajar Hari Ini (${currentDay})</h3>
                </div>
                <div class="card-body">
                    ${todaySchedule.length === 0 ? `
                        <div class="empty-state">
                            <i class="fas fa-calendar-times"></i>
                            <h3>Tidak ada jadwal hari ini</h3>
                            <p>Anda tidak memiliki jadwal mengajar untuk hari ini</p>
                        </div>
                    ` : todaySchedule.map(j => {
                        const kelasData = kelas.find(k => k.id === j.kelasId);
                        const mapelData = mapel.find(m => m.id === j.mapelId);
                        const today = Helpers.getToday();
                        const absensi = DataStore.get('absensi');
                        const sudahAbsen = absensi.some(a => a.jadwalId === j.id && a.tanggal === today);

                        return `
                            <div class="schedule-card">
                                <div class="schedule-info">
                                    <h4>${mapelData?.nama || '-'}</h4>
                                    <p><i class="fas fa-school"></i> Kelas: ${kelasData?.nama || '-'}</p>
                                    <p><i class="fas fa-clock"></i> Jam: ${j.jamMulai} - ${j.jamSelesai}</p>
                                    ${sudahAbsen ? '<span class="badge badge-success"><i class="fas fa-check"></i> Sudah Absen</span>' : '<span class="badge badge-warning"><i class="fas fa-exclamation"></i> Belum Absen</span>'}
                                </div>
                                <div>
                                    ${sudahAbsen ? `
                                        <button class="btn btn-secondary" onclick="GuruModule.lihatAbsensi(${j.id})">
                                            <i class="fas fa-eye"></i> Lihat
                                        </button>
                                    ` : `
                                        <button class="btn btn-success" onclick="GuruModule.mulaiAbsensi(${j.id})">
                                            <i class="fas fa-clipboard-check"></i> Mulai Absensi
                                        </button>
                                    `}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-calendar-week"></i> Semua Jadwal Mengajar</h3>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Hari</th>
                                    <th>Jam</th>
                                    <th>Kelas</th>
                                    <th>Mata Pelajaran</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${jadwal.map(j => {
                                    const kelasData = kelas.find(k => k.id === j.kelasId);
                                    const mapelData = mapel.find(m => m.id === j.mapelId);
                                    return `
                                    <tr>
                                        <td><span class="badge badge-primary">${j.hari}</span></td>
                                        <td>${j.jamMulai} - ${j.jamSelesai}</td>
                                        <td>${kelasData?.nama || '-'}</td>
                                        <td>${mapelData?.nama || '-'}</td>
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

    // Mulai Absensi
    mulaiAbsensi(jadwalId) {
        const jadwal = DataStore.findById('jadwal', jadwalId);
        const kelas = DataStore.findById('kelas', jadwal.kelasId);
        const mapel = DataStore.findById('mapel', jadwal.mapelId);
        const siswa = DataStore.findBy('siswa', 'kelasId', jadwal.kelasId);
        const today = Helpers.getToday();

        const content = `
            <div style="margin-bottom: 20px;">
                <h4>${mapel.nama}</h4>
                <p>Kelas: ${kelas.nama} | ${jadwal.hari}, ${jadwal.jamMulai} - ${jadwal.jamSelesai}</p>
                <p>Tanggal: ${Helpers.formatDate(today)}</p>
            </div>
            <form id="formAbsensi">
                <div class="table-container" style="max-height: 400px; overflow-y: auto;">
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>NISN</th>
                                <th>Nama Siswa</th>
                                <th>Status</th>
                                <th>Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${siswa.map((s, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${s.nisn}</td>
                                    <td>${s.nama}</td>
                                    <td>
                                        <div class="attendance-status">
                                            <label class="hadir">
                                                <input type="radio" name="status_${s.id}" value="hadir" checked>
                                                <span>Hadir</span>
                                            </label>
                                            <label class="izin">
                                                <input type="radio" name="status_${s.id}" value="izin">
                                                <span>Izin</span>
                                            </label>
                                            <label class="sakit">
                                                <input type="radio" name="status_${s.id}" value="sakit">
                                                <span>Sakit</span>
                                            </label>
                                            <label class="alpa">
                                                <input type="radio" name="status_${s.id}" value="alpa">
                                                <span>Alpa</span>
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <input type="text" name="keterangan_${s.id}" placeholder="Keterangan (opsional)" style="width: 100%; padding: 5px; border: 1px solid #e1e5eb; border-radius: 4px;">
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="form-actions" style="margin-top: 20px;">
                    <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-save"></i> Simpan Absensi
                    </button>
                </div>
            </form>
        `;

        App.openModal('Input Absensi', content);
        document.querySelector('.modal').style.maxWidth = '900px';

        document.getElementById('formAbsensi').addEventListener('submit', (e) => {
            e.preventDefault();
            
            siswa.forEach(s => {
                const status = document.querySelector(`input[name="status_${s.id}"]:checked`).value;
                const keterangan = document.querySelector(`input[name="keterangan_${s.id}"]`).value;

                DataStore.add('absensi', {
                    siswaId: s.id,
                    jadwalId: jadwalId,
                    tanggal: today,
                    status: status,
                    keterangan: keterangan,
                    waktuInput: new Date().toISOString()
                });
            });

            DataStore.addLog(Auth.getUser().id, 'attendance', `Input absensi ${kelas.nama} - ${mapel.nama}`);
            
            // Notifikasi otomatis untuk siswa yang alpa
            this.sendNotificationToParents(siswa, jadwalId);

            App.closeModal();
            App.showNotification('Absensi berhasil disimpan!', 'success');
            this.renderDashboard();
        });
    },

    // Kirim notifikasi ke orang tua
    sendNotificationToParents(siswa, jadwalId) {
        const absensi = DataStore.get('absensi');
        const today = Helpers.getToday();
        const alpaList = absensi.filter(a => 
            a.jadwalId === jadwalId && 
            a.tanggal === today && 
            a.status === 'alpa'
        );

        if (alpaList.length > 0) {
            console.log(`Notifikasi dikirim ke ${alpaList.length} orang tua (Siswa Alpa)`);
            DataStore.addLog(Auth.getUser().id, 'notification', `Notifikasi alpa dikirim ke ${alpaList.length} orang tua`);
        }
    },

    // Lihat Absensi
    lihatAbsensi(jadwalId) {
        const jadwal = DataStore.findById('jadwal', jadwalId);
        const kelas = DataStore.findById('kelas', jadwal.kelasId);
        const mapel = DataStore.findById('mapel', jadwal.mapelId);
        const today = Helpers.getToday();
        const absensi = DataStore.get('absensi').filter(a => a.jadwalId === jadwalId && a.tanggal === today);
        const siswa = DataStore.get('siswa');

        const content = `
            <div style="margin-bottom: 20px;">
                <h4>${mapel.nama}</h4>
                <p>Kelas: ${kelas.nama} | ${Helpers.formatDate(today)}</p>
            </div>
            <div class="summary-grid" style="margin-bottom: 20px;">
                <div class="summary-box hadir">
                    <h4>${absensi.filter(a => a.status === 'hadir').length}</h4>
                    <p>Hadir</p>
                </div>
                <div class="summary-box izin">
                    <h4>${absensi.filter(a => a.status === 'izin').length}</h4>
                    <p>Izin</p>
                </div>
                <div class="summary-box sakit">
                    <h4>${absensi.filter(a => a.status === 'sakit').length}</h4>
                    <p>Sakit</p>
                </div>
                <div class="summary-box alpa">
                    <h4>${absensi.filter(a => a.status === 'alpa').length}</h4>
                    <p>Alpa</p>
                </div>
            </div>
            <div class="table-container" style="max-height: 400px; overflow-y: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Siswa</th>
                            <th>Status</th>
                            <th>Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${absensi.map((a, index) => {
                            const siswaData = siswa.find(s => s.id === a.siswaId);
                            return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${siswaData?.nama || '-'}</td>
                                <td><span class="badge ${Helpers.getStatusBadge(a.status)}">${Helpers.capitalize(a.status)}</span></td>
                                <td>${a.keterangan || '-'}</td>
                            </tr>
                        `}).join('')}
                    </tbody>
                </table>
            </div>
            <div class="form-actions" style="margin-top: 20px;">
                <button type="button" class="btn btn-primary" onclick="App.closeModal()">Tutup</button>
            </div>
        `;

        App.openModal('Detail Absensi', content);
        document.querySelector('.modal').style.maxWidth = '700px';
    },

    // Halaman Input Absensi
    renderAbsensi() {
        const user = Auth.getUser();
        const guru = DataStore.get('guru').find(g => g.userId === user.id);
        const jadwal = DataStore.get('jadwal').filter(j => j.guruId === guru?.id);
        const kelas = DataStore.get('kelas');
        const mapel = DataStore.get('mapel');
        const today = Helpers.getToday();
        const absensi = DataStore.get('absensi');

        const html = `
            <div class="page-header">
                <h2>Input Absensi</h2>
                <p>Kelola absensi siswa</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-clipboard-list"></i> Daftar Jadwal Mengajar</h3>
                </div>
                <div class="card-body">
                    ${jadwal.length === 0 ? `
                        <div class="empty-state">
                            <i class="fas fa-calendar-times"></i>
                            <h3>Tidak ada jadwal</h3>
                            <p>Anda belum memiliki jadwal mengajar</p>
                        </div>
                    ` : jadwal.map(j => {
                        const kelasData = kelas.find(k => k.id === j.kelasId);
                        const mapelData = mapel.find(m => m.id === j.mapelId);
                        const sudahAbsen = absensi.some(a => a.jadwalId === j.id && a.tanggal === today);

                        return `
                            <div class="schedule-card">
                                <div class="schedule-info">
                                    <h4>${mapelData?.nama || '-'}</h4>
                                    <p><i class="fas fa-school"></i> Kelas: ${kelasData?.nama || '-'}</p>
                                    <p><i class="fas fa-calendar"></i> ${j.hari}, ${j.jamMulai} - ${j.jamSelesai}</p>
                                    ${sudahAbsen && Helpers.getCurrentDayName() === j.hari ? 
                                        '<span class="badge badge-success"><i class="fas fa-check"></i> Sudah Absen Hari Ini</span>' : 
                                        Helpers.getCurrentDayName() === j.hari ?
                                        '<span class="badge badge-warning"><i class="fas fa-exclamation"></i> Belum Absen</span>' : 
                                        '<span class="badge badge-secondary"><i class="fas fa-info"></i> Bukan Hari Ini</span>'
                                    }
                                </div>
                                <div>
                                    ${Helpers.getCurrentDayName() === j.hari ? (
                                        sudahAbsen ? `
                                            <button class="btn btn-secondary" onclick="GuruModule.lihatAbsensi(${j.id})">
                                                <i class="fas fa-eye"></i> Lihat
                                            </button>
                                        ` : `
                                            <button class="btn btn-success" onclick="GuruModule.mulaiAbsensi(${j.id})">
                                                <i class="fas fa-clipboard-check"></i> Mulai Absensi
                                            </button>
                                        `
                                    ) : `
                                        <button class="btn btn-secondary" disabled>
                                            <i class="fas fa-ban"></i> Bukan Hari Ini
                                        </button>
                                    `}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        App.render(html);
    },

    // Riwayat Absensi
    renderRiwayat() {
        const user = Auth.getUser();
        const guru = DataStore.get('guru').find(g => g.userId === user.id);
        const jadwal = DataStore.get('jadwal').filter(j => j.guruId === guru?.id);
        const jadwalIds = jadwal.map(j => j.id);
        const absensi = DataStore.get('absensi').filter(a => jadwalIds.includes(a.jadwalId));
        const siswa = DataStore.get('siswa');
        const kelas = DataStore.get('kelas');
        const mapel = DataStore.get('mapel');
        const today = Helpers.getToday();

        // Group by date
        const groupedByDate = {};
        absensi.forEach(a => {
            if (!groupedByDate[a.tanggal]) {
                groupedByDate[a.tanggal] = [];
            }
            groupedByDate[a.tanggal].push(a);
        });

        const html = `
            <div class="page-header">
                <h2>Riwayat Absensi</h2>
                <p>Lihat riwayat absensi yang telah diinput</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-history"></i> Riwayat Absensi</h3>
                </div>
                <div class="card-body">
                    <div class="filter-bar">
                        <input type="date" id="filterTanggalGuru" class="filter-select" value="${today}" onchange="GuruModule.filterRiwayat()">
                        <select id="filterJadwalGuru" class="filter-select" onchange="GuruModule.filterRiwayat()">
                            <option value="">Semua Jadwal</option>
                            ${jadwal.map(j => {
                                const kelasData = kelas.find(k => k.id === j.kelasId);
                                const mapelData = mapel.find(m => m.id === j.mapelId);
                                return `<option value="${j.id}">${kelasData?.nama} - ${mapelData?.nama}</option>`;
                            }).join('')}
                        </select>
                    </div>

                    <div id="riwayatContent">
                        ${this.generateRiwayatTable(today, null, jadwalIds)}
                    </div>
                </div>
            </div>
        `;

        App.render(html);
    },

    generateRiwayatTable(tanggal, jadwalId, jadwalIds) {
        let absensi = DataStore.get('absensi').filter(a => 
            a.tanggal === tanggal && jadwalIds.includes(a.jadwalId)
        );

        if (jadwalId) {
            absensi = absensi.filter(a => a.jadwalId === parseInt(jadwalId));
        }

        const siswa = DataStore.get('siswa');
        const jadwal = DataStore.get('jadwal');
        const kelas = DataStore.get('kelas');
        const mapel = DataStore.get('mapel');

        if (absensi.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>Tidak ada data</h3>
                    <p>Belum ada riwayat absensi untuk filter yang dipilih</p>
                </div>
            `;
        }

        // Summary
        const hadir = absensi.filter(a => a.status === 'hadir').length;
        const izin = absensi.filter(a => a.status === 'izin').length;
        const sakit = absensi.filter(a => a.status === 'sakit').length;
        const alpa = absensi.filter(a => a.status === 'alpa').length;

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
                            <th>Siswa</th>
                            <th>Kelas</th>
                            <th>Mata Pelajaran</th>
                            <th>Status</th>
                            <th>Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${absensi.map((a, index) => {
                            const siswaData = siswa.find(s => s.id === a.siswaId);
                            const jadwalData = jadwal.find(j => j.id === a.jadwalId);
                            const kelasData = kelas.find(k => k.id === jadwalData?.kelasId);
                            const mapelData = mapel.find(m => m.id === jadwalData?.mapelId);
                            return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${siswaData?.nama || '-'}</td>
                                <td><span class="badge badge-info">${kelasData?.nama || '-'}</span></td>
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

    filterRiwayat() {
        const user = Auth.getUser();
        const guru = DataStore.get('guru').find(g => g.userId === user.id);
        const jadwal = DataStore.get('jadwal').filter(j => j.guruId === guru?.id);
        const jadwalIds = jadwal.map(j => j.id);
        const tanggal = document.getElementById('filterTanggalGuru').value;
        const jadwalId = document.getElementById('filterJadwalGuru').value;
        document.getElementById('riwayatContent').innerHTML = this.generateRiwayatTable(tanggal, jadwalId, jadwalIds);
    }
};
