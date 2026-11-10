// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

/**
 * =========================================================================
 * TRANG ĐĂNG NHẬP (LOGIN PAGE - FORMIK & YUP VALIDATION)
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. Formik & Yup: Quản lý biểu mẫu đăng nhập, xác thực email/username và mật khẩu.
 * 2. Phân quyền vai trò (Role):
 *    - Admin: Đăng nhập vào bảng điều khiển quản trị CRUD (/admin).
 *    - User thường: Đăng nhập vào để thực hiện đơn nhận nuôi, khám phá thú cưng.
 * 3. Hỗ trợ nút nạp nhanh tài khoản mẫu để giáo viên / người kiểm thử tiện trải nghiệm.
 * =========================================================================
 */

const loginSchema = Yup.object({
  identifier: Yup.string()
    .trim()
    .required('Vui lòng nhập Email hoặc Tên đăng nhập'),
  password: Yup.string()
    .min(6, 'Mật khẩu phải từ 6 ký tự trở lên')
    .required('Vui lòng nhập mật khẩu')
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      identifier: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      setErrorMessage('');
      const result = login(values);

      if (result.success) {
        setSuccessMessage(`Đăng nhập thành công! Xin chào ${result.user.fullName}`);
        setTimeout(() => {
          // Admin thì vào trang Quản trị, Thành viên thì vào danh sách thú cưng
          if (result.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/pets');
          }
        }, 500);
      } else {
        setErrorMessage(result.message);
      }
    }
  });

  // Nạp nhanh tài khoản mẫu
  const handleQuickLogin = (identifier, password) => {
    formik.setValues({ identifier, password });
    setErrorMessage('');
    const result = login({ identifier, password });
    if (result.success) {
      setSuccessMessage(`Đăng nhập thành công với vai trò ${result.user.role === 'admin' ? 'Quản Trị Viên (Admin)' : 'Thành viên'}!`);
      setTimeout(() => {
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/pets');
        }
      }, 500);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '900px' }}>
      <Row className="g-4 align-items-stretch">
        {/* CỘT TRÁI: FORM ĐĂNG NHẬP */}
        <Col lg={7}>
          <Card className="shadow-sm border-0 rounded-4 h-100 p-4 p-md-5">
            <div className="mb-4 text-center text-lg-start">
              <h2 className="fw-bold text-primary mb-1">Đăng Nhập Pet Haven</h2>
              <p className="text-muted small">
                Đăng nhập để quản lý đơn nhận nuôi hoặc truy cập khu vực quản trị viên
              </p>
            </div>

            {errorMessage && (
              <Alert variant="danger" dismissible onClose={() => setErrorMessage('')} className="py-2 small">
                {errorMessage}
              </Alert>
            )}

            {successMessage && (
              <Alert variant="success" className="py-2 small">
                {successMessage}
              </Alert>
            )}

            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Email hoặc Tên đăng nhập *</Form.Label>
                <Form.Control
                  type="text"
                  name="identifier"
                  placeholder="admin@pethaven.com hoặc user@pethaven.com"
                  value={formik.values.identifier}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.identifier && !!formik.errors.identifier}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.identifier}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Mật khẩu *</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.password && !!formik.errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-100 rounded-pill fw-bold py-2 shadow-sm mb-3"
              >
                Đăng Nhập
              </Button>

              <div className="text-center small text-muted">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="fw-bold text-primary text-decoration-none">
                  Đăng ký thành viên mới
                </Link>
              </div>
            </Form>
          </Card>
        </Col>

        {/* CỘT PHẢI: BẢNG HƯỚNG DẪN TÀI KHOẢN MẪU (CHO TESTER/GIÁO VIÊN) */}
        <Col lg={5}>
          <Card className="shadow-sm border-0 rounded-4 h-100 p-4 bg-light border-start border-4 border-primary">
            <h5 className="fw-bold text-dark mb-3">Tài Khoản Kiểm Thử Nhanh</h5>
            <p className="text-muted small mb-4">
              Hệ thống đã chuẩn bị sẵn hai loại tài khoản tương ứng với hai vai trò riêng biệt để bạn tiện kiểm tra:
            </p>

            {/* Khối tài khoản Admin */}
            <div className="bg-white p-3 rounded-3 shadow-sm mb-3 border">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong className="text-danger">Tài khoản Quản Trị Viên</strong>
                <Badge bg="danger">Admin Role</Badge>
              </div>
              <div className="small text-secondary mb-1">
                Tài khoản: <code className="text-dark fw-bold">admin@pethaven.com</code>
              </div>
              <div className="small text-secondary mb-3">
                Mật khẩu: <code className="text-dark fw-bold">admin123</code>
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                className="w-100 rounded-pill fw-semibold"
                onClick={() => handleQuickLogin('admin@pethaven.com', 'admin123')}
              >
                1-Click Đăng Nhập Admin
              </Button>
            </div>

            {/* Khối tài khoản User thường */}
            <div className="bg-white p-3 rounded-3 shadow-sm border">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong className="text-primary">Tài khoản Thành Viên</strong>
                <Badge bg="primary">User Role</Badge>
              </div>
              <div className="small text-secondary mb-1">
                Tên: <strong className="text-dark">Ta Huu Nguyen</strong>
              </div>
              <div className="small text-secondary mb-1">
                Tài khoản: <code className="text-dark fw-bold">user@pethaven.com</code>
              </div>
              <div className="small text-secondary mb-3">
                Mật khẩu: <code className="text-dark fw-bold">user123</code>
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                className="w-100 rounded-pill fw-semibold"
                onClick={() => handleQuickLogin('user@pethaven.com', 'user123')}
              >
                1-Click Đăng Nhập Ta Huu Nguyen
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
