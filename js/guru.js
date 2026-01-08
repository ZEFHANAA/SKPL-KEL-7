// ===== GURU MODULE =====

const GuruModule = {
    // Load page
    loadPage(page) {
        switch (page) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'jadwal-guru':
                this.renderJadwalGuru();
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
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h3><i class="fas fa-calendar-week"></i> Semua Jadwal Mengajar</h3>
                    <button class="btn btn-primary" onclick="GuruModule.viewDetailedSchedule()">
                        <i class="fas fa-eye"></i> Lihat Detail
                    </button>
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

    // Jadwal Mengajar Page (New Feature)
    renderJadwalGuru() {
        const user = Auth.getUser();
        const guru = DataStore.get('guru').find(g => g.userId === user.id);
        const jadwal = DataStore.get('jadwal').filter(j => j.guruId === guru?.id);
        const kelas = DataStore.get('kelas');
        const mapel = DataStore.get('mapel');
        const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

        // Group by day
        const groupedByDay = {};
        days.forEach(day => {
            groupedByDay[day] = jadwal.filter(j => j.hari === day).sort((a, b) => 
                a.jamMulai.localeCompare(b.jamMulai)
            );
        });

        const html = `
            <div class="page-header">
                <h2>Jadwal Mengajar</h2>
                <p>Jadwal mengajar yang diampu: ${user.name}</p>
                <button class="btn btn-success" onclick="GuruModule.exportScheduleToPDF()">
                    <i class="fas fa-download"></i> Unduh Jadwal
                </button>
            </div>

            <div class="stats-grid" style="margin-bottom: 20px;">
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${jadwal.length}</h3>
                        <p>Total Jadwal Mengajar</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="fas fa-school"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${[...new Set(jadwal.map(j => j.kelasId))].length}</h3>
                        <p>Jumlah Kelas</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${[...new Set(jadwal.map(j => j.mapelId))].length}</h3>
                        <p>Mata Pelajaran</p>
                    </div>
                </div>
            </div>

            ${days.map(day => `
                <div class="card" style="margin-bottom: 20px;">
                    <div class="card-header">
                        <h3><i class="fas fa-calendar-day"></i> ${day}</h3>
                        <span class="badge ${groupedByDay[day].length > 0 ? 'badge-success' : 'badge-secondary'}">
                            ${groupedByDay[day].length} Jadwal
                        </span>
                    </div>
                    <div class="card-body">
                        ${groupedByDay[day].length === 0 ? `
                            <div class="empty-state" style="padding: 20px;">
                                <i class="fas fa-calendar-times"></i>
                                <p>Tidak ada jadwal untuk hari ini</p>
                            </div>
                        ` : `
                            <div class="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Jam</th>
                                            <th>Kelas</th>
                                            <th>Mata Pelajaran</th>
                                            <th>Durasi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${groupedByDay[day].map(j => {
                                            const kelasData = kelas.find(k => k.id === j.kelasId);
                                            const mapelData = mapel.find(m => m.id === j.mapelId);
                                            
                                            // Calculate duration
                                            const start = j.jamMulai.split(':');
                                            const end = j.jamSelesai.split(':');
                                            const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
                                            const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
                                            const duration = (endMinutes - startMinutes) / 60;
                                            
                                            return `
                                            <tr>
                                                <td>
                                                    <strong>${j.jamMulai} - ${j.jamSelesai}</strong>
                                                </td>
                                                <td>
                                                    <span class="badge badge-info">${kelasData?.nama || '-'}</span>
                                                </td>
                                                <td>${mapelData?.nama || '-'}</td>
                                                <td>${duration.toFixed(1)} jam</td>
                                            </tr>
                                        `}).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `}
                    </div>
                </div>
            `).join('')}
        `;

        App.render(html);
    },

    // Mulai Absensi
    mulaiAbsensi(jadwalId) {
        // Authorization check
        if (!Auth.canAccessSchedule(jadwalId)) {
            App.showNotification('Anda tidak memiliki akses ke jadwal ini!', 'error');
            return;
        }

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
        // Authorization check
        if (!Auth.canAccessSchedule(jadwalId)) {
            App.showNotification('Anda tidak memiliki akses ke jadwal ini!', 'error');
            return;
        }

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
                            <th>Aksi</th>
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
                                <td>
                                    <button class="btn btn-sm btn-warning" onclick="GuruModule.editAbsensi(${a.id})" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </td>
                            </tr>
                        `}).join('')}
                    </tbody>
                </table>
            </div>
            <div class="form-actions" style="margin-top: 20px;">
                <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Tutup</button>
                <button type="button" class="btn btn-success" onclick="GuruModule.exportAbsensiToday(${jadwalId})">
                    <i class="fas fa-download"></i> Unduh Laporan
                </button>
            </div>
        `;

        App.openModal('Detail Absensi', content);
        document.querySelector('.modal').style.maxWidth = '800px';
    },

    // Edit Absensi (New Feature)
    editAbsensi(absensiId) {
        // Authorization check
        if (!Auth.canEditAttendance(absensiId)) {
            App.showNotification('Anda tidak memiliki akses untuk mengedit absensi ini!', 'error');
            return;
        }

        const absensi = DataStore.findById('absensi', absensiId);
        const siswa = DataStore.findById('siswa', absensi.siswaId);
        const jadwal = DataStore.findById('jadwal', absensi.jadwalId);
        const kelas = DataStore.findById('kelas', jadwal.kelasId);
        const mapel = DataStore.findById('mapel', jadwal.mapelId);

        const content = `
            <div style="margin-bottom: 20px;">
                <h4>Edit Absensi: ${siswa.nama}</h4>
                <p>Kelas: ${kelas.nama} | Mata Pelajaran: ${mapel.nama}</p>
                <p>Tanggal: ${Helpers.formatDate(absensi.tanggal)}</p>
            </div>
            <form id="formEditAbsensi">
                <div class="form-group">
                    <label>Status Kehadiran</label>
                    <div class="attendance-status" style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <label class="hadir" style="flex: 1; min-width: 100px;">
                            <input type="radio" name="status" value="hadir" ${absensi.status === 'hadir' ? 'checked' : ''}>
                            <span>Hadir</span>
                        </label>
                        <label class="izin" style="flex: 1; min-width: 100px;">
                            <input type="radio" name="status" value="izin" ${absensi.status === 'izin' ? 'checked' : ''}>
                            <span>Izin</span>
                        </label>
                        <label class="sakit" style="flex: 1; min-width: 100px;">
                            <input type="radio" name="status" value="sakit" ${absensi.status === 'sakit' ? 'checked' : ''}>
                            <span>Sakit</span>
                        </label>
                        <label class="alpa" style="flex: 1; min-width: 100px;">
                            <input type="radio" name="status" value="alpa" ${absensi.status === 'alpa' ? 'checked' : ''}>
                            <span>Alpa</span>
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="editKeterangan">Keterangan</label>
                    <textarea id="editKeterangan" name="keterangan" rows="3" style="width: 100%; padding: 8px; border: 1px solid #e1e5eb; border-radius: 4px;">${absensi.keterangan || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-save"></i> Simpan Perubahan
                    </button>
                </div>
            </form>
        `;

        App.openModal('Edit Absensi', content);
        document.querySelector('.modal').style.maxWidth = '600px';

        document.getElementById('formEditAbsensi').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newStatus = document.querySelector('input[name="status"]:checked').value;
            const newKeterangan = document.getElementById('editKeterangan').value;

            // Update absensi
            DataStore.update('absensi', absensiId, {
                status: newStatus,
                keterangan: newKeterangan,
                waktuEdit: new Date().toISOString()
            });

            DataStore.addLog(Auth.getUser().id, 'edit', `Edit absensi ${siswa.nama} - ${mapel.nama} menjadi ${newStatus}`);
            
            App.closeModal();
            App.showNotification('Absensi berhasil diperbarui!', 'success');
            
            // Refresh the view
            setTimeout(() => {
                this.lihatAbsensi(jadwal.id);
            }, 300);
        });
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
                        const isToday = Helpers.getCurrentDayName() === j.hari;

                        return `
                            <div class="schedule-card">
                                <div class="schedule-info">
                                    <h4>${mapelData?.nama || '-'}</h4>
                                    <p><i class="fas fa-school"></i> Kelas: ${kelasData?.nama || '-'}</p>
                                    <p><i class="fas fa-calendar"></i> ${j.hari}, ${j.jamMulai} - ${j.jamSelesai}</p>
                                    ${sudahAbsen ? 
                                        '<span class="badge badge-success"><i class="fas fa-check"></i> Sudah Absen Hari Ini</span>' : 
                                        isToday ?
                                        '<span class="badge badge-warning"><i class="fas fa-exclamation"></i> Belum Absen</span>' : 
                                        '<span class="badge badge-info"><i class="fas fa-calendar"></i> Jadwal ' + j.hari + '</span>'
                                    }
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
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h3><i class="fas fa-history"></i> Riwayat Absensi</h3>
                    <button class="btn btn-success" onclick="GuruModule.exportRiwayatAbsensi()">
                        <i class="fas fa-download"></i> Unduh Laporan
                    </button>
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
    },

    // === NEW FEATURES: EXPORT & DOWNLOAD REPORTS ===
    
    // Export today's attendance to CSV
    exportAbsensiToday(jadwalId) {
        // Authorization check
        if (!Auth.canAccessSchedule(jadwalId)) {
            App.showNotification('Anda tidak memiliki akses ke jadwal ini!', 'error');
            return;
        }

        const jadwal = DataStore.findById('jadwal', jadwalId);
        const kelas = DataStore.findById('kelas', jadwal.kelasId);
        const mapel = DataStore.findById('mapel', jadwal.mapelId);
        const today = Helpers.getToday();
        const absensi = DataStore.get('absensi').filter(a => a.jadwalId === jadwalId && a.tanggal === today);
        const siswa = DataStore.get('siswa');

        if (absensi.length === 0) {
            App.showNotification('Tidak ada data absensi untuk diekspor!', 'warning');
            return;
        }

        // Generate CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "LAPORAN ABSENSI SISWA\n";
        csvContent += `Mata Pelajaran: ${mapel.nama}\n`;
        csvContent += `Kelas: ${kelas.nama}\n`;
        csvContent += `Tanggal: ${Helpers.formatDate(today)}\n`;
        csvContent += `Guru: ${Auth.getUser().name}\n\n`;
        
        csvContent += "No,NISN,Nama Siswa,Status,Keterangan\n";
        
        absensi.forEach((a, index) => {
            const siswaData = siswa.find(s => s.id === a.siswaId);
            csvContent += `${index + 1},${siswaData?.nisn || '-'},${siswaData?.nama || '-'},${a.status},${a.keterangan || '-'}\n`;
        });

        // Summary
        csvContent += "\nRINGKASAN\n";
        csvContent += `Hadir,${absensi.filter(a => a.status === 'hadir').length}\n`;
        csvContent += `Izin,${absensi.filter(a => a.status === 'izin').length}\n`;
        csvContent += `Sakit,${absensi.filter(a => a.status === 'sakit').length}\n`;
        csvContent += `Alpa,${absensi.filter(a => a.status === 'alpa').length}\n`;
        csvContent += `Total,${absensi.length}\n`;

        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Absensi_${kelas.nama}_${mapel.nama}_${today}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        DataStore.addLog(Auth.getUser().id, 'export', `Ekspor absensi ${kelas.nama} - ${mapel.nama} tanggal ${today}`);
        App.showNotification('Laporan berhasil diunduh!', 'success');
    },

    // Export attendance history by date range
    exportRiwayatAbsensi() {
        const user = Auth.getUser();
        const guru = DataStore.get('guru').find(g => g.userId === user.id);
        const jadwal = DataStore.get('jadwal').filter(j => j.guruId === guru?.id);
        const jadwalIds = jadwal.map(j => j.id);
        
        const tanggal = document.getElementById('filterTanggalGuru')?.value || Helpers.getToday();
        const jadwalId = document.getElementById('filterJadwalGuru')?.value;

        let absensi = DataStore.get('absensi').filter(a => 
            a.tanggal === tanggal && jadwalIds.includes(a.jadwalId)
        );

        if (jadwalId) {
            absensi = absensi.filter(a => a.jadwalId === parseInt(jadwalId));
        }

        if (absensi.length === 0) {
            App.showNotification('Tidak ada data untuk diekspor!', 'warning');
            return;
        }

        const siswa = DataStore.get('siswa');
        const kelas = DataStore.get('kelas');
        const mapel = DataStore.get('mapel');

        // Generate CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "RIWAYAT ABSENSI SISWA\n";
        csvContent += `Guru: ${user.name}\n`;
        csvContent += `Tanggal: ${Helpers.formatDate(tanggal)}\n\n`;
        
        csvContent += "No,Nama Siswa,Kelas,Mata Pelajaran,Status,Keterangan\n";
        
        absensi.forEach((a, index) => {
            const siswaData = siswa.find(s => s.id === a.siswaId);
            const jadwalData = jadwal.find(j => j.id === a.jadwalId);
            const kelasData = kelas.find(k => k.id === jadwalData?.kelasId);
            const mapelData = mapel.find(m => m.id === jadwalData?.mapelId);
            
            csvContent += `${index + 1},${siswaData?.nama || '-'},${kelasData?.nama || '-'},${mapelData?.nama || '-'},${a.status},${a.keterangan || '-'}\n`;
        });

        // Summary
        csvContent += "\nRINGKASAN\n";
        csvContent += `Hadir,${absensi.filter(a => a.status === 'hadir').length}\n`;
        csvContent += `Izin,${absensi.filter(a => a.status === 'izin').length}\n`;
        csvContent += `Sakit,${absensi.filter(a => a.status === 'sakit').length}\n`;
        csvContent += `Alpa,${absensi.filter(a => a.status === 'alpa').length}\n`;
        csvContent += `Total,${absensi.length}\n`;

        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Riwayat_Absensi_${tanggal}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        DataStore.addLog(Auth.getUser().id, 'export', `Ekspor riwayat absensi tanggal ${tanggal}`);
        App.showNotification('Riwayat absensi berhasil diunduh!', 'success');
    },

    // View detailed teaching schedule (enhanced version)
    viewDetailedSchedule() {
        const user = Auth.getUser();
        const guru = DataStore.get('guru').find(g => g.userId === user.id);
        const jadwal = DataStore.get('jadwal').filter(j => j.guruId === guru?.id);
        const kelas = DataStore.get('kelas');
        const mapel = DataStore.get('mapel');

        // Group by day
        const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const groupedByDay = {};
        days.forEach(day => {
            groupedByDay[day] = jadwal.filter(j => j.hari === day).sort((a, b) => 
                a.jamMulai.localeCompare(b.jamMulai)
            );
        });

        const content = `
            <div style="margin-bottom: 20px;">
                <h4>Jadwal Mengajar: ${user.name}</h4>
                <p>Total ${jadwal.length} jadwal mengajar</p>
            </div>
            <div style="max-height: 500px; overflow-y: auto;">
                ${days.map(day => `
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: var(--primary-color); margin-bottom: 10px;">
                            <i class="fas fa-calendar-day"></i> ${day}
                        </h4>
                        ${groupedByDay[day].length === 0 ? 
                            '<p style="color: #999; padding: 10px; background: #f5f5f5; border-radius: 4px;">Tidak ada jadwal</p>' :
                            groupedByDay[day].map(j => {
                                const kelasData = kelas.find(k => k.id === j.kelasId);
                                const mapelData = mapel.find(m => m.id === j.mapelId);
                                return `
                                    <div style="padding: 12px; margin-bottom: 8px; background: #f9fafb; border-left: 4px solid var(--primary-color); border-radius: 4px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center;">
                                            <div>
                                                <strong style="font-size: 14px;">${mapelData?.nama || '-'}</strong>
                                                <p style="margin: 4px 0; color: #666; font-size: 13px;">
                                                    <i class="fas fa-school"></i> Kelas: ${kelasData?.nama || '-'}
                                                </p>
                                            </div>
                                            <div style="text-align: right;">
                                                <span style="background: var(--primary-color); color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">
                                                    <i class="fas fa-clock"></i> ${j.jamMulai} - ${j.jamSelesai}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')
                        }
                    </div>
                `).join('')}
            </div>
            <div class="form-actions" style="margin-top: 20px;">
                <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Tutup</button>
                <button type="button" class="btn btn-success" onclick="GuruModule.exportScheduleToPDF()">
                    <i class="fas fa-file-pdf"></i> Cetak Jadwal
                </button>
            </div>
        `;

        App.openModal('Jadwal Mengajar Lengkap', content);
        document.querySelector('.modal').style.maxWidth = '800px';
    },

    // Export schedule (simple text format for printing)
    exportScheduleToPDF() {
        const user = Auth.getUser();
        const guru = DataStore.get('guru').find(g => g.userId === user.id);
        const jadwal = DataStore.get('jadwal').filter(j => j.guruId === guru?.id);
        const kelas = DataStore.get('kelas');
        const mapel = DataStore.get('mapel');

        const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        
        // Generate CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "JADWAL MENGAJAR\n";
        csvContent += `Guru: ${user.name}\n`;
        csvContent += `Tanggal Cetak: ${Helpers.formatDate(new Date())}\n\n`;
        
        days.forEach(day => {
            const daySchedule = jadwal.filter(j => j.hari === day).sort((a, b) => 
                a.jamMulai.localeCompare(b.jamMulai)
            );
            
            csvContent += `\n${day}\n`;
            csvContent += "Jam,Kelas,Mata Pelajaran\n";
            
            if (daySchedule.length === 0) {
                csvContent += "-,Tidak ada jadwal,-\n";
            } else {
                daySchedule.forEach(j => {
                    const kelasData = kelas.find(k => k.id === j.kelasId);
                    const mapelData = mapel.find(m => m.id === j.mapelId);
                    csvContent += `${j.jamMulai} - ${j.jamSelesai},${kelasData?.nama || '-'},${mapelData?.nama || '-'}\n`;
                });
            }
        });

        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Jadwal_Mengajar_${user.name.replace(/\s/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        DataStore.addLog(Auth.getUser().id, 'export', 'Ekspor jadwal mengajar');
        App.showNotification('Jadwal berhasil diunduh!', 'success');    }
};