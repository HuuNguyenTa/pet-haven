// src/components/AdoptionForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

/**
 * =========================================================================
 * BIỂU MẪU ĐĂNG KÝ NHẬN NUÔI (FORMIK & YUP VALIDATION)
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. Yup Validation Schema: Đặt quy tắc kiểm tra nghiêm ngặt cho người nhận nuôi.
 * 2. Formik Hook useFormik: Quản lý values, errors, touched, handleSubmit, handleChange, handleBlur.
 * 3. Hiển thị thông báo lỗi thân thiện (Feedback invalid) khi touched && errors.
 * =========================================================================
 */

// 1. Định nghĩa bộ quy tắc Yup Validation Schema
const adoptionValidationSchema = Yup.object({
  fullName: Yup.string()
    .min(3, 'Họ và tên phải có ít nhất 3 ký tự')
    .required('Họ và tên không được để trống'),
  email: Yup.string()
    .email('Địa chỉ email không hợp lệ (ví dụ: name@example.com)')
    .required('Email liên lạc không được để trống'),
  phone: Yup.string()
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải gồm 10 đến 11 chữ số')
    .required('Số điện thoại không được để trống'),
  address: Yup.string()
    .min(5, 'Địa chỉ cư trú phải có ít nhất 5 ký tự')
    .required('Địa chỉ nhà không được để trống'),
  housingType: Yup.string()
    .oneOf(['Apartment', 'HouseWithYard', 'Villa'], 'Vui lòng chọn loại hình không gian sống')
    .required('Vui lòng chọn không gian nuôi thú cưng'),
  experience: Yup.string()
    .oneOf(['Beginner', 'Experienced'], 'Vui lòng chọn mức độ kinh nghiệm')
    .required('Kinh nghiệm nuôi thú cưng là bắt buộc'),
  agreeTerms: Yup.boolean()
    .oneOf([true], 'Bạn phải cam kết yêu thương và không ngược đãi thú cưng')
    .required('Cam kết trách nhiệm là bắt buộc')
});

function AdoptionForm({ isCartEmpty, onSubmitAdoption }) {
  // 2. Khởi tạo Hook useFormik
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      housingType: 'HouseWithYard',
      experience: 'Experienced',
      agreeTerms: false
    },
    validationSchema: adoptionValidationSchema,
    onSubmit: (values, { resetForm }) => {
      // Gọi hàm callback từ component cha (App.jsx)
      onSubmitAdoption(values);
      resetForm();
    }
  });

  return (
    <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
      <Card.Header className="bg-primary text-white py-3">
        <h5 className="mb-0 fw-bold">Hồ Sơ Đăng Ký Người Nhận Nuôi</h5>
      </Card.Header>

      <Card.Body className="p-4">
        <Form onSubmit={formik.handleSubmit}>
          {/* HỌ VÀ TÊN */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Họ và Tên chủ nuôi *</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              placeholder="Nhập đầy đủ họ và tên của bạn"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.fullName && !!formik.errors.fullName}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.fullName}
            </Form.Control.Feedback>
          </Form.Group>

          {/* EMAIL & SỐ ĐIỆN THOẠI */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.email && !!formik.errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Số điện thoại *</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  placeholder="Ví dụ: 0912345678"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.phone && !!formik.errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.phone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* ĐỊA CHỈ NHÀ */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Địa chỉ nơi cư trú *</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="address"
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.address && !!formik.errors.address}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.address}
            </Form.Control.Feedback>
          </Form.Group>

          {/* KHÔNG GIAN SỐNG & KINH NGHIỆM */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Không gian sống *</Form.Label>
                <Form.Select
                  name="housingType"
                  value={formik.values.housingType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.housingType && !!formik.errors.housingType}
                >
                  <option value="Apartment">Chung cư / Căn hộ</option>
                  <option value="HouseWithYard">Nhà phố có sân vườn</option>
                  <option value="Villa">Biệt thự rộng rãi</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Kinh nghiệm nuôi thú cưng *</Form.Label>
                <Form.Select
                  name="experience"
                  value={formik.values.experience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.experience && !!formik.errors.experience}
                >
                  <option value="Experienced">Đã từng nuôi / Có kinh nghiệm</option>
                  <option value="Beginner">Người mới bắt đầu lần đầu nuôi</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* CAM KẾT ĐIỀU KHOẢN */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              label="Tôi cam kết chăm sóc yêu thương, tiêm phòng định kỳ và không bỏ rơi bé thú cưng *"
              checked={formik.values.agreeTerms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.agreeTerms && !!formik.errors.agreeTerms}
              feedback={formik.errors.agreeTerms}
              feedbackType="invalid"
            />
          </Form.Group>

          {/* NÚT SUBMIT */}
          <Button
            type="submit"
            variant="warning"
            size="lg"
            className="w-100 fw-bold text-dark shadow-sm py-3 rounded-pill mt-2"
            disabled={isCartEmpty}
          >
            {isCartEmpty ? 'Danh sách trống (Không thể gửi)' : 'Gửi Hồ Sơ Nhận Nuôi Ngay'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default AdoptionForm;
