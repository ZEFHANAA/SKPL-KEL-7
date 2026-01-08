// ===== MAIN APPLICATION =====

const App = {
    // Current page
    currentPage: 'dashboard',

    // Initialize app
    init() {
        this.setupEventListeners();
        this.checkAuth();
        this.initTheme();
    },

    // Setup event listeners
    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Toggle sidebar
        document.getElementById('toggleSidebar').addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('show');
                this.toggleSidebarOverlay();
            } else {
                sidebar.classList.toggle('collapsed');
            }
        });

        // Modal close
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') {
                this.closeModal();
            }
        });

        // Close sidebar on window resize
        window.addEventListener('resize', () => {
            const sidebar = document.getElementById('sidebar');
            if (window.innerWidth > 768) {
                sidebar.classList.remove('show');
                this.removeSidebarOverlay();
            }
        });

        // Update date
        this.updateDate();
    },

    // Toggle sidebar overlay for mobile
    toggleSidebarOverlay() {
        let overlay = document.getElementById('sidebarOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'sidebarOverlay';
            overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1500;';
            overlay.addEventListener('click', () => {
                document.getElementById('sidebar').classList.remove('show');
                this.removeSidebarOverlay();
            });
            document.body.appendChild(overlay);
        } else {
            this.removeSidebarOverlay();
        }
    },

    // Remove sidebar overlay
    removeSidebarOverlay() {
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.remove();
        }
    },

    // Update current date display
    updateDate() {
        document.getElementById('currentDate').textContent = Helpers.formatDate(new Date());
    },

    // Initialize theme
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            const themeIcon = document.querySelector('#themeToggle i');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        }
    },

    // Toggle theme
    toggleTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('#themeToggle i');
        
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            this.showNotification('Dark mode activated', 'success');
        } else {
            localStorage.setItem('theme', 'light');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            this.showNotification('Light mode activated', 'success');
        }
    },

    // Check authentication
    checkAuth() {
        if (Auth.isLoggedIn()) {
            this.showApp();
        } else {
            this.showLogin();
        }
    },

    // Handle login
    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const result = Auth.login(username, password);

        if (result.success) {
            this.showNotification('Login berhasil!', 'success');
            this.showApp();
        } else {
            this.showNotification(result.message, 'error');
        }
    },

    // Handle logout
    handleLogout() {
        Auth.logout();
        this.showLogin();
        this.showNotification('Logout berhasil!', 'info');
    },

    // Show login page
    showLogin() {
        document.getElementById('loginPage').classList.remove('hidden');
        document.getElementById('appContainer').classList.add('hidden');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    },

    // Show main app
    showApp() {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
        
        const user = Auth.getUser();
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userRole').textContent = Auth.getRoleDisplayName(user.role);

        this.setupSidebar();
        this.loadDashboard();
    },

    // Setup sidebar based on role
    setupSidebar() {
        const user = Auth.getUser();
        const nav = document.getElementById('sidebarNav');
        
        let menuItems = [];

        switch (user.role) {
            case 'admin':
                menuItems = [
                    { id: 'dashboard', icon: 'fas fa-tachometer-alt', text: 'Dashboard' },
                    { id: 'users', icon: 'fas fa-users-cog', text: 'Manajemen Pengguna' },
                    { id: 'siswa', icon: 'fas fa-user-graduate', text: 'Data Siswa' },
                    { id: 'guru', icon: 'fas fa-chalkboard-teacher', text: 'Data Guru' },
                    { id: 'kelas', icon: 'fas fa-school', text: 'Data Kelas' },
                    { id: 'mapel', icon: 'fas fa-book', text: 'Mata Pelajaran' },
                    { id: 'jadwal', icon: 'fas fa-calendar-alt', text: 'Jadwal Pelajaran' },
                    { id: 'rekap', icon: 'fas fa-clipboard-check', text: 'Rekap Absensi' },
                    { id: 'log', icon: 'fas fa-history', text: 'Log Aktivitas' },
                ];
                break;
            case 'guru':
                menuItems = [
                    { id: 'dashboard', icon: 'fas fa-tachometer-alt', text: 'Dashboard' },
                    { id: 'jadwal-guru', icon: 'fas fa-calendar-week', text: 'Jadwal Mengajar' },
                    { id: 'absensi', icon: 'fas fa-clipboard-list', text: 'Input Absensi' },
                    { id: 'riwayat', icon: 'fas fa-history', text: 'Riwayat Absensi' },
                ];
                break;
            case 'siswa':
            case 'ortu':
                menuItems = [
                    { id: 'dashboard', icon: 'fas fa-tachometer-alt', text: 'Dashboard' },
                    { id: 'riwayat', icon: 'fas fa-history', text: 'Riwayat Absensi' },
                ];
                break;
        }

        nav.innerHTML = menuItems.map(item => `
            <div class="nav-item ${item.id === 'dashboard' ? 'active' : ''}" data-page="${item.id}">
                <i class="${item.icon}"></i>
                <span>${item.text}</span>
            </div>
        `).join('');

        // Add click events
        nav.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                nav.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.loadPage(item.dataset.page);
                
                // Auto close sidebar on mobile after click
                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('show');
                    this.removeSidebarOverlay();
                }
            });
        });
    },

    // Load page
    loadPage(page) {
        this.currentPage = page;
        const user = Auth.getUser();

        switch (user.role) {
            case 'admin':
                AdminModule.loadPage(page);
                break;
            case 'guru':
                GuruModule.loadPage(page);
                break;
            case 'siswa':
            case 'ortu':
                SiswaModule.loadPage(page, user.role);
                break;
        }
    },

    // Load dashboard
    loadDashboard() {
        this.loadPage('dashboard');
    },

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notificationMessage');
        
        notification.className = `notification ${type}`;
        messageEl.textContent = message;
        notification.classList.remove('hidden');

        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    },

    // Open modal
    openModal(title, content) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = content;
        document.getElementById('modalOverlay').classList.remove('hidden');
    },

    // Close modal
    closeModal() {
        document.getElementById('modalOverlay').classList.add('hidden');
    },

    // Render content
    render(html) {
        document.getElementById('contentArea').innerHTML = html;
    },

    // Confirm dialog
    confirm(message, callback) {
        const content = `
            <p style="margin-bottom: 20px;">${message}</p>
            <div class="form-actions">
                <button class="btn btn-secondary" onclick="App.closeModal()">Batal</button>
                <button class="btn btn-danger" id="confirmBtn">Ya, Lanjutkan</button>
            </div>
        `;
        this.openModal('Konfirmasi', content);
        
        document.getElementById('confirmBtn').addEventListener('click', () => {
            callback();
            this.closeModal();
        });
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
