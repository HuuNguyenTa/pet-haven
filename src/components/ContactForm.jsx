// src/components/ContactForm.jsx
import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';

/**
 * =========================================================================
 * TRANG LIÊN HỆ & TƯ VẤN THÚ CƯNG (FORMIK & YUP)
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. Formik quản lý trạng thái form liên hệ.
 * 2. Yup kiểm tra định dạng email, độ dài tin nhắn.
 * 3. Hiển thị thông báo phản hồi thành công sau khi gửi tin nhắn.
 * =========================================================================
 */

const contactSchema = Yup.object({
  fullName: Yup.string()
    .min(3, 'Tên người liên hệ phải có ít nhất 3 ký tự')
    .required('Vui lòng nhập họ và tên'),
  email: Yup.string()
    .email('Địa chỉ email không hợp lệ')
    .required('Vui lòng nhập email'),
  phone: Yup.string()
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải từ 10 - 11 số')
    .required('Vui lòng nhập số điện thoại'),
  subject: Yup.string()
    .required('Vui lòng chọn chủ đề cần hỗ trợ'),
  message: Yup.string()
    .min(10, 'Nội dung tin nhắn phải từ 10 ký tự trở lên')
    .required('Vui lòng nhập nội dung cần tư vấn')
});

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
      subject: 'Tư vấn nhận nuôi',
      message: ''
    },
    validationSchema: contactSchema,
    onSubmit: (values, { resetForm }) => {
      setSubmitted(true);
      resetForm();
    }
  });

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Liên Hệ Với Pet Haven</h2>
        <p className="text-muted">
          Bạn có thắc mắc về quy trình nhận nuôi hay cần tư vấn sức khỏe cho thú cưng? Hãy để lại lời nhắn!
        </p>
      </div>

      {submitted && (
        <Alert variant="success" dismissible onClose={() => setSubmitted(false)} className="rounded-3 shadow-sm mb-4">
          <Alert.Heading className="fw-bold">Gửi Lời Nhắn Thành Công!</Alert.Heading>
          <p className="mb-0">
            Cảm ơn bạn đã liên hệ. Đội ngũ bác sĩ thú y và tư vấn viên của Pet Haven sẽ phản hồi bạn trong thời gian sớm nhất!
          </p>
        </Alert>
      )}

      <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
        <Card.Body className="p-4 p-md-5">
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Họ và Tên *</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                placeholder="Ta Huu Nguyen"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.fullName && !!formik.errors.fullName}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.fullName}</Form.Control.Feedback>
            </Form.Group>

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
                  <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Số điện thoại *</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="0912345678"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.phone && !!formik.errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.phone}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Chủ đề hỗ trợ *</Form.Label>
              <Form.Select
                name="subject"
                value={formik.values.subject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.subject && !!formik.errors.subject}
              >
                <option value="Tư vấn nhận nuôi">Tư vấn quy trình nhận nuôi bé</option>
                <option value="Tư vấn dinh dưỡng">Tư vấn dinh dưỡng & tiêm phòng</option>
                <option value="Đăng ký làm tình nguyện viên">Đăng ký làm tình nguyện viên chăm sóc</option>
                <option value="Hợp tác cứu trợ">Hợp tác cứu trợ thú cưng lang thang</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{formik.errors.subject}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Nội dung tin nhắn *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="message"
                placeholder="Nhập chi tiết câu hỏi hoặc lời nhắn của bạn..."
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.message && !!formik.errors.message}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.message}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary" size="lg" className="w-100 rounded-pill fw-bold py-3 shadow-sm">
              Gửi Tin Nhắn Cho Pet Haven
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ContactForm;
