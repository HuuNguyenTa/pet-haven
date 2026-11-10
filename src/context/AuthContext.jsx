// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * =========================================================================
 * CONTEXT HOOK & EFFECT HOOK: QUẢN LÝ XÁC THỰC & PHÂN QUYỀN (AuthContext)
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. createContext: Chia sẻ trạng thái đăng nhập, vai trò (Role: User / Admin) toàn app.
 * 2. useState kết hợp Lazy Initialization để đọc dữ liệu từ localStorage lúc khởi động.
 * 3. useEffect để tự động đồng bộ tài khoản và phiên đăng nhập.
 * 4. Quản lý danh sách tài khoản riêng biệt cho Admin và User.
 * =========================================================================
 */

// Danh sách tài khoản mặc định của hệ thống
const DEFAULT_ACCOUNTS = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@pethaven.com',
    password: 'admin123',
    fullName: 'Quản Trị Viên (Admin)',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  },
  {
    id: 'user-1',
    username: 'user',
    email: 'user@pethaven.com',
    password: 'user123',
    fullName: 'Ta Huu Nguyen',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TaHuuNguyen'
  }
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 1. Quản lý danh sách tài khoản trong localStorage
  const [accounts, setAccounts] = useState(() => {
    try {
      const savedAccounts = localStorage.getItem('pet_app_users_accounts');
      if (savedAccounts) {
        const parsed = JSON.parse(savedAccounts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Luôn chuẩn hoá tên tài khoản thành viên thành Ta Huu Nguyen
          const cleaned = parsed.map((acc) =>
            acc.role === 'user' && (acc.fullName === 'Nguyễn Văn A' || acc.fullName === 'Thành Viên Thử Nghiệm')
              ? { ...acc, fullName: 'Ta Huu Nguyen' }
              : acc
          );
          localStorage.setItem('pet_app_users_accounts', JSON.stringify(cleaned));
          return cleaned;
        }
      }
    } catch {
      // Bỏ qua lỗi parse
    }
    localStorage.setItem('pet_app_users_accounts', JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  });

  // 2. Quản lý phiên đăng nhập hiện tại
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('pet_app_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        // Tự động đồng bộ tên thành viên thành Ta Huu Nguyen
        if (parsed?.role === 'user' && parsed?.fullName !== 'Ta Huu Nguyen') {
          parsed.fullName = 'Ta Huu Nguyen';
          localStorage.setItem('pet_app_user', JSON.stringify(parsed));
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Đồng bộ phiên đăng nhập vào localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('pet_app_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pet_app_user');
    }
  }, [user]);

  // Đồng bộ danh sách tài khoản vào localStorage
  useEffect(() => {
    localStorage.setItem('pet_app_users_accounts', JSON.stringify(accounts));
  }, [accounts]);

  /**
   * Đăng nhập người dùng bằng email/username và mật khẩu
   * @param {Object} credentials - { identifier, password }
   * @returns {Object} { success: boolean, message?: string }
   */
  const login = ({ identifier, password }) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const found = accounts.find(
      (acc) =>
        (acc.email.toLowerCase() === cleanId || acc.username.toLowerCase() === cleanId) &&
        acc.password === password
    );

    if (!found) {
      return {
        success: false,
        message: 'Tài khoản hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!'
      };
    }

    const sessionUser = {
      id: found.id,
      username: found.username,
      email: found.email,
      fullName: found.fullName,
      role: found.role,
      avatar: found.avatar
    };

    setUser(sessionUser);
    return { success: true, user: sessionUser };
  };

  /**
   * Đăng ký tài khoản mới cho khách hàng (mặc định role: 'user')
   * @param {Object} formData - { fullName, email, password }
   * @returns {Object} { success: boolean, message?: string }
   */
  const register = ({ fullName, email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    // Kiểm tra email đã tồn tại hay chưa
    const isExisted = accounts.some((acc) => acc.email.toLowerCase() === cleanEmail);
    if (isExisted) {
      return {
        success: false,
        message: 'Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc Đăng nhập!'
      };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      username: cleanEmail.split('@')[0],
      email: cleanEmail,
      password: password,
      fullName: fullName.trim(),
      role: 'user', // Mặc định người dùng đăng ký mới luôn có role user
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`
    };

    const updatedAccounts = [...accounts, newUser];
    setAccounts(updatedAccounts);

    // Tự động đăng nhập sau khi đăng ký thành công
    const sessionUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      avatar: newUser.avatar
    };
    setUser(sessionUser);

    return { success: true, user: sessionUser };
  };

  /**
   * Đăng xuất phiên làm việc
   */
  const logout = () => {
    setUser(null);
  };

  // Cờ nhận diện quyền Admin
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        login,
        register,
        logout,
        defaultAccounts: DEFAULT_ACCOUNTS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider!');
  }
  return context;
}
