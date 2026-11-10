// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * =========================================================================
 * CONTEXT HOOK & EFFECT HOOK: QUẢN LÝ GIAO DIỆN SÁNG / TỐI (ThemeContext)
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. Dark/Light Mode chuyển đổi toàn ứng dụng.
 * 2. Tương thích trực tiếp với chuẩn data-bs-theme của Bootstrap 5.3+.
 * 3. useEffect đồng bộ lựa chọn theme vào localStorage để ghi nhớ qua các lần F5.
 * =========================================================================
 */

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Lấy theme đã lưu hoặc mặc định là 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pet_app_theme') || 'light';
  });

  // Effect Hook: Khi theme thay đổi, cập nhật localStorage và thuộc tính của body
  useEffect(() => {
    localStorage.setItem('pet_app_theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  // Hàm chuyển đổi giữa Sáng và Tối
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme phải được sử dụng bên trong ThemeProvider!');
  }
  return context;
}
