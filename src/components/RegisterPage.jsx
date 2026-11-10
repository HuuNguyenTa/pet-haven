// src/components/RegisterPage.jsx
import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

/**
 * =========================================================================
 * TRANG ĐĂNG KÝ THÀNH VIÊN MỚI (REGISTER PAGE - FORMIK & YUP)
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. Formik & Yup: Quản lý biểu mẫu đăng ký với xác thực nghiêm ngặt.
 * 2. So sánh mật khẩu bằng Yup.ref('password').
 * 3. Tự động lưu tài khoản vào localStorage và đăng nhập tức thì cho người dùng.
 * =========================================================================
 */

const registerSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(3, 'Họ và tên phải có ít nhất 3 ký tự')
    .required('Vui lòng nhập họ và tên của bạn'),
  email: Yup.string()
    .trim()
    .email('Định dạng email không hợp lệ (ví dụ: name@example.com)')
    .required('Vui lòng nhập địa chỉ email'),
  password: Yup.string()
    .min(6, 'Mật khẩu phải chứa ít nhất 6 ký tự')
    .required('Vui lòng tạo mật khẩu'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp với mật khẩu đã tạo')
    .required('Vui lòng nhập lại mật khẩu xác nhận'),
  agreeTerms: Yup.boolean()
    .oneOf([true], 'Bạn cần đồng ý với điều khoản sử dụng và quy định bảo trợ của Pet Haven')
    .required('Cam kết điều khoản là bắt buộc')
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      setErrorMessage('');
      const result = register({
        fullName: values.fullName,
        email: values.email,
        password: values.password
      });

      if (result.success) {
        setSuccessMessage('Đăng ký tài khoản thành công! Bạn đang được chuyển hướng...');
        setTimeout(() => {
          navigate('/pets');
        }, 1000);
      } else {
        setErrorMessage(result.message);
      }
    }
  });

  return (
    <Container className="py-5" style={{ maxWidth: '580px' }}>
      <Card className="shadow-sm border-0 rounded-4 p-4 p-md-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary mb-1">Đăng Ký Thành Viên</h2>
          <p className="text-muted small">
            Trở thành thành viên của Pet Haven để bắt đầu hành trình nhận nuôi và bảo trợ thú cưng
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
          {/* HỌ VÀ TÊN */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Họ và Tên *</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              placeholder="Ví dụ: Trần Thị Lan"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.fullName && !!formik.errors.fullName}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.fullName}
            </Form.Control.Feedback>
          </Form.Group>

          {/* EMAIL */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email liên hệ *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="lan.tran@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.email && !!formik.errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          {/* MẬT KHẨU */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Mật khẩu *</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Tối thiểu 6 ký tự"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.password && !!formik.errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          {/* XÁC NHẬN MẬT KHẨU */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Xác nhận mật khẩu *</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu vừa tạo"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>

          {/* ĐỒNG Ý ĐIỀU KHOẢN */}
          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              id="agreeTermsRegister"
              name="agreeTerms"
              label="Tôi cam kết tuân thủ quy tắc ứng xử và bảo vệ quyền lợi động vật của Pet Haven *"
              checked={formik.values.agreeTerms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.agreeTerms && !!formik.errors.agreeTerms}
              feedback={formik.errors.agreeTerms}
              feedbackType="invalid"
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-100 rounded-pill fw-bold py-2 shadow-sm mb-3"
          >
            Đăng Ký Tài Khoản
          </Button>

          <div className="text-center small text-muted">
            Đã có tài khoản?{' '}
            <Link to="/login" className="fw-bold text-primary text-decoration-none">
              Đăng nhập ngay
            </Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default RegisterPage;
