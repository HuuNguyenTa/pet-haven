// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

/**
 * =========================================================================
 * PROTECTED ROUTE (BẢO VỆ TUYẾN ĐƯỜNG & PHÂN QUYỀN TRUY CẬP)
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. React Router: Điều hướng an toàn (Navigate) bảo vệ các trang nhạy cảm.
 * 2. Phân quyền vai trò (Role-Based Access Control):
 *    - Guest (chưa đăng nhập): Bị chuyển hướng sang /login.
 *    - User thường: Bị chặn nếu cố truy cập trang Admin (/admin).
 *    - Admin: Được cấp quyền truy cập toàn diện vào Dashboard CRUD.
 * =========================================================================
 */
function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAdmin } = useAuth();

  // 1. Nếu chưa đăng nhập: chuyển hướng thẳng về trang Đăng nhập sạch sẽ (không lưu param redirect)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu trang yêu cầu quyền Admin mà người dùng chỉ có vai trò User thường: Chặn truy cập
  if (requireAdmin && !isAdmin) {
    return (
      <Container className="py-5" style={{ maxWidth: '650px' }}>
        <Alert variant="danger" className="shadow-sm rounded-4 p-4 text-center">
          <h4 className="fw-bold mb-3">Truy Cập Bị Từ Chối!</h4>
          <p className="mb-4 text-secondary">
            Tài khoản hiện tại của bạn (<strong>{user.fullName}</strong> - Vai trò: <em>Thành viên</em>) không có quyền hạn truy cập vào khu vực quản trị cơ sở dữ liệu.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/" variant="outline-danger" className="rounded-pill px-4">
              Về Trang Chủ
            </Button>
            <Button as={Link} to="/login" variant="danger" className="rounded-pill px-4 fw-bold">
              Đăng Nhập Bằng Tài Khoản Admin
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // 3. Đạt điều kiện bảo vệ: render component con
  return children;
}

export default ProtectedRoute;
