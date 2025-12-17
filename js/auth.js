// ===== AUTHENTICATION MODULE =====

const Auth = {
    // Current user
    currentUser: null,

    // Login
    login(username, password) {
        const users = DataStore.get('users');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = user;
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            DataStore.addLog(user.id, 'login', `${user.name} login ke sistem`);
            return { success: true, user };
        }
        
        return { success: false, message: 'Username atau password salah!' };
    },

    // Logout
    logout() {
        if (this.currentUser) {
            DataStore.addLog(this.currentUser.id, 'logout', `${this.currentUser.name} logout dari sistem`);
        }
        this.currentUser = null;
        sessionStorage.removeItem('currentUser');
    },

    // Check if logged in
    isLoggedIn() {
        if (this.currentUser) return true;
        
        const stored = sessionStorage.getItem('currentUser');
        if (stored) {
            this.currentUser = JSON.parse(stored);
            return true;
        }
        
        return false;
    },

    // Get current user
    getUser() {
        if (!this.currentUser) {
            const stored = sessionStorage.getItem('currentUser');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    },

    // Check role
    hasRole(role) {
        const user = this.getUser();
        return user && user.role === role;
    },

    // Get role display name
    getRoleDisplayName(role) {
        const roles = {
            'admin': 'Administrator',
            'guru': 'Guru',
            'siswa': 'Siswa',
            'ortu': 'Orang Tua'
        };
        return roles[role] || role;
    },

    // Change password
    changePassword(userId, oldPassword, newPassword) {
        const users = DataStore.get('users');
        const user = users.find(u => u.id === userId);
        
        if (!user) {
            return { success: false, message: 'User tidak ditemukan!' };
        }
        
        if (user.password !== oldPassword) {
            return { success: false, message: 'Password lama salah!' };
        }
        
        DataStore.update('users', userId, { password: newPassword });
        DataStore.addLog(userId, 'edit', 'Password diubah');
        
        return { success: true, message: 'Password berhasil diubah!' };
    },

    // Reset password (admin only)
    resetPassword(userId, newPassword = '123456') {
        const result = DataStore.update('users', userId, { password: newPassword });
        if (result) {
            DataStore.addLog(this.currentUser.id, 'edit', `Reset password user ID: ${userId}`);
            return { success: true, message: 'Password berhasil direset!' };
        }
        return { success: false, message: 'Gagal mereset password!' };
    }
};
