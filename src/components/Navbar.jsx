// src/components/Navbar.jsx
import React from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

/**
 * =========================================================================
 * THANH ĐIỀU HƯỚNG CHÍNH (NAVIGATION BAR)
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. React Router: Thẻ Link và NavLink điều hướng trang SPA mà không reload.
 * 2. AuthContext: Nhận diện người dùng (Guest / User / Admin) để ẩn/hiện menu quản trị.
 * 3. ThemeContext: Nút bấm chuyển đổi Dark / Light mode.
 * 4. Props: Nhận cartCount để hiển thị Badge số lượng thú cưng trong đơn.
 * =========================================================================
 */
function NavigationBar({ cartCount = 0 }) {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/', { replace: true });
    logout();
  };

  return (
    <Navbar
      bg={theme === 'dark' ? 'dark' : 'white'}
      variant={theme === 'dark' ? 'dark' : 'light'}
      expand="lg"
      className="shadow-sm border-bottom sticky-top py-2"
    >
      <Container>
        {/* LOGO: Với Admin thì về trang Quản trị, với User/Guest thì về Landing Page */}
        <Navbar.Brand as={Link} to={isAdmin ? "/admin" : "/"} className="fw-bold fs-4 d-flex align-items-center">
          <span className="text-primary">Pet<span className="text-warning">Haven</span></span>
          {isAdmin && (
            <Badge bg="danger" className="ms-2 fs-6">Admin Panel</Badge>
          )}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          {/* CÁC ĐƯỜNG DẪN ĐIỀU HƯỚNG THEO VAI TRÒ */}
          <Nav className="me-auto gap-1">
            {isAdmin ? (
              /* KHI LÀ ADMIN: Chỉ hiển thị menu quản trị hệ thống */
              <Nav.Link as={NavLink} to="/admin" className="text-danger fw-bold">
                Admin Dashboard
              </Nav.Link>
            ) : user ? (
              /* KHI LÀ USER ĐÃ ĐĂNG NHẬP: Hiển thị đầy đủ menu cho người nhận nuôi */
              <>
                <Nav.Link as={NavLink} to="/" end className="fw-semibold">
                  Trang Chủ
                </Nav.Link>
                <Nav.Link as={NavLink} to="/pets" className="fw-semibold">
                  Thú Cưng
                </Nav.Link>
                <Nav.Link as={NavLink} to="/rare-pets" className="fw-semibold">
                  Giống Quý Hiếm
                </Nav.Link>
                <Nav.Link as={NavLink} to="/adoption" className="fw-semibold d-flex align-items-center gap-1">
                  Đơn Nhận Nuôi
                  {cartCount > 0 && (
                    <Badge bg="danger" pill className="ms-1">
                      {cartCount}
                    </Badge>
                  )}
                </Nav.Link>
                <Nav.Link as={NavLink} to="/contact" className="fw-semibold">
                  Liên Hệ
                </Nav.Link>
              </>
            ) : null /* KHI CHƯA ĐĂNG NHẬP (GUEST): Ẩn toàn bộ menu, chỉ xem Landing Page và Đăng nhập/Đăng ký */}
          </Nav>

          {/* KHU VỰC TIỆN ÍCH: THEME & AUTHENTICATION */}
          <Nav className="align-items-center gap-2 mt-2 mt-lg-0">
            {/* Nút chuyển đổi Dark/Light mode */}
            <Button
              variant={theme === 'dark' ? 'warning' : 'outline-secondary'}
              size="sm"
              onClick={toggleTheme}
              className="rounded-pill px-3 me-1"
            >
              {theme === 'dark' ? 'Chế độ Sáng' : 'Chế độ Tối'}
            </Button>

            {/* Trạng thái xác thực */}
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <img
                  src={user.avatar}
                  alt={user.fullName || user.username}
                  className="rounded-circle border"
                  style={{ width: '32px', height: '32px' }}
                />
                <div className="d-flex flex-column align-items-start leading-tight">
                  <span className="fw-semibold small">
                    {user.fullName || user.username}
                  </span>
                  <Badge bg={isAdmin ? 'danger' : 'primary'} style={{ fontSize: '0.65rem' }}>
                    {isAdmin ? 'Quản Trị Viên' : 'Thành Viên'}
                  </Badge>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-pill ms-1"
                >
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-primary"
                  size="sm"
                  className="rounded-pill px-3 fw-semibold"
                >
                  Đăng Nhập
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  size="sm"
                  className="rounded-pill px-3 fw-semibold"
                >
                  Đăng Ký
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
