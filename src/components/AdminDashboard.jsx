// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Modal, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getAllPets, createPet, updatePet, deletePet } from '../services/petService';
import { useAuth } from '../context/AuthContext';

/**
 * =========================================================================
 * BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN (ADMIN DASHBOARD - FULL CRUD & FORMIK YUP)
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. Route Guard (Bảo vệ tuyến đường): Chặn người dùng thường, chỉ mở cho Admin.
 * 2. Fetch API CRUD đầy đủ:
 *    - GET: Tải danh sách thú cưng vào bảng
 *    - POST: Thêm mới thú cưng lên MockAPI
 *    - PUT: Chỉnh sửa thông tin thú cưng theo ID
 *    - DELETE: Xóa thú cưng khỏi cơ sở dữ liệu
 * 3. Formik & Yup Validation: Quản lý Form thêm/sửa với hàng rào xác thực chặt chẽ.
 * 4. Thuộc tính enableReinitialize: true: Tự động nạp dữ liệu cũ khi bấm "Sửa".
 * 5. Tối ưu UI Synchronization: Dùng .map(), .filter(), [...prev] cập nhật tức thì.
 * =========================================================================
 */

// 1. QUY TẮC XÁC THỰC DỮ LIỆU THÚ CƯNG VỚI YUP
const petValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Tên bé phải có ít nhất 2 ký tự')
    .required('Tên bé không được để trống'),
  breed: Yup.string()
    .required('Giống loài không được để trống'),
  category: Yup.string()
    .oneOf(['Dogs', 'Cats', 'Birds', 'Rabbits'], 'Vui lòng chọn danh mục hợp lệ')
    .required('Danh mục thú cưng là bắt buộc'),
  price: Yup.number()
    .typeError('Phí nhận nuôi phải là một con số')
    .positive('Phí nhận nuôi phải lớn hơn 0')
    .required('Phí nhận nuôi không được để trống'),
  age: Yup.string()
    .required('Độ tuổi không được để trống'),
  rating: Yup.number()
    .min(1, 'Đánh giá tối thiểu 1 sao')
    .max(5, 'Đánh giá tối đa 5 sao')
    .required('Vui lòng chọn số sao'),
  origin: Yup.string()
    .required('Xuất xứ không được để trống'),
  color: Yup.string()
    .required('Màu lông không được để trống'),
  image: Yup.string()
    .url('Đường dẫn ảnh phải là một URL hợp lệ (bắt đầu bằng http/https)')
    .required('Link hình ảnh không được để trống'),
  description: Yup.string()
    .min(10, 'Mô tả phải có ít nhất 10 ký tự')
    .required('Mô tả tính cách không được để trống')
});

function AdminDashboard() {
  const { isAdmin } = useAuth(); // Lấy quyền hạn từ AuthContext

  // State danh sách thú cưng, trạng thái loading và phản hồi người dùng
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // State điều khiển Modal: nếu editingPet === null -> Thêm mới; nếu có object -> Chỉnh sửa
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  // Hàm tải danh sách thú cưng từ MockAPI
  const fetchPets = async () => {
    try {
      setLoading(true);
      const data = await getAllPets();
      setPets(data);
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Tự động tải danh sách thú cưng khi đã xác thực quyền Admin
  useEffect(() => {
    if (isAdmin) {
      fetchPets();
    }
  }, [isAdmin]);

  /**
   * BỘ ĐIỀU KHIỂN FORMIK QUẢN LÝ THÊM / SỬA
   * enableReinitialize: true giúp nạp lại dữ liệu của bé đang sửa vào form
   */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editingPet?.name || '',
      breed: editingPet?.breed || '',
      category: editingPet?.category || 'Dogs',
      price: editingPet?.price || '',
      age: editingPet?.age || '',
      rating: editingPet?.rating || 5,
      origin: editingPet?.origin || '',
      color: editingPet?.color || '',
      image: editingPet?.image || '',
      description: editingPet?.description || '',
      isSpecial: editingPet?.isSpecial ?? false,
      isVaccinated: editingPet?.isVaccinated ?? true
    },
    validationSchema: petValidationSchema,
    onSubmit: async (values) => {
      try {
        setActionLoading(true);

        if (editingPet) {
          // ==========================================
          // NHÁNH 1: SỬA DỮ LIỆU BẰNG PHƯƠNG THỨC PUT
          // ==========================================
          const updated = await updatePet(editingPet.id, values);

          // Đồng bộ UI bằng .map() (Thay thế đúng phần tử trùng ID tức thì)
          setPets((prev) =>
            prev.map((item) => (String(item.id) === String(updated.id) ? updated : item))
          );

          setMessage({ type: 'success', text: `Cập nhật thông tin bé "${updated.name}" thành công!` });
        } else {
          // ==========================================
          // NHÁNH 2: TẠO MỚI DỮ LIỆU BẰNG PHƯƠNG THỨC POST
          // ==========================================
          const created = await createPet(values);

          // Đồng bộ UI bằng Spread Operator (Nối bé mới vào mảng)
          setPets((prev) => [...prev, created]);

          setMessage({ type: 'success', text: `Thêm mới bé "${created.name}" lên MockAPI thành công!` });
        }

        setShowModal(false); // Đóng Modal
      } catch (err) {
        setMessage({ type: 'danger', text: err.message });
      } finally {
        setActionLoading(false);
      }
    }
  });

  /**
   * XỬ LÝ HÀNH ĐỘNG XÓA (DELETE API)
   */
  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bé "${name}" khỏi cơ sở dữ liệu MockAPI không?`)) {
      try {
        setActionLoading(true);
        await deletePet(id);

        // Đồng bộ UI bằng .filter() (Loại bỏ bé vừa xóa khỏi giao diện ngay lập tức)
        setPets((prev) => prev.filter((item) => String(item.id) !== String(id)));

        setMessage({ type: 'success', text: `Đã xóa bé "${name}" thành công!` });
      } catch (err) {
        setMessage({ type: 'danger', text: err.message });
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Mở modal ở chế độ THÊM MỚI (reset trắng form)
  const handleOpenAdd = () => {
    setEditingPet(null);
    formik.resetForm();
    setShowModal(true);
  };

  // Mở modal ở chế độ SỬA (đổ dữ liệu bé đang chọn)
  const handleOpenEdit = (pet) => {
    setEditingPet(pet);
    setShowModal(true);
  };

  return (
    <Container className="py-4">
      {/* TIÊU ĐỀ & NÚT THÊM MỚI */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="fw-bold text-danger mb-0">Quản Lý Cơ Sở Dữ Liệu Thú Cưng</h2>
        </div>
        <Button variant="success" onClick={handleOpenAdd} disabled={actionLoading} className="fw-bold rounded-pill shadow-sm">
          Thêm Thú Cưng Mới
        </Button>
      </div>

      {/* THÔNG BÁO PHẢN HỒI (USER FEEDBACK) */}
      {message && (
        <Alert variant={message.type} dismissible onClose={() => setMessage(null)} className="rounded-3 shadow-sm mb-4">
          {message.text}
        </Alert>
      )}

      {/* BẢNG DANH SÁCH THÚ CƯNG */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" />
          <p className="mt-2 text-muted">Đang tải cơ sở dữ liệu thú cưng từ MockAPI...</p>
        </div>
      ) : (
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <Table responsive bordered hover className="align-middle mb-0 text-center">
            <thead className="table-dark">
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th style={{ width: '80px' }}>Hình ảnh</th>
                <th>Tên bé</th>
                <th>Giống loài</th>
                <th>Phân loại</th>
                <th>Phí nhận nuôi</th>
                <th>Đặc tính & Tiêm chủng</th>
                <th>Đánh giá</th>
                <th style={{ width: '160px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr key={pet.id}>
                  <td className="text-muted fw-bold">{pet.id}</td>
                  <td>
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="rounded-3 shadow-sm"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  </td>
                  <td className="fw-bold text-primary text-start">{pet.name}</td>
                  <td className="text-start">{pet.breed}</td>
                  <td>
                    <Badge bg="info" className="text-dark">{pet.category}</Badge>
                  </td>
                  <td className="fw-bold text-success">${pet.price}</td>
                  <td>
                    {pet.isSpecial && <Badge bg="danger" className="me-1">Giống quý</Badge>}
                    {pet.isVaccinated ? (
                      <Badge bg="success">Đã tiêm</Badge>
                    ) : (
                      <Badge bg="secondary">Chưa tiêm</Badge>
                    )}
                  </td>
                  <td className="text-warning">
                    {'★'.repeat(pet.rating || 5)}
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="rounded-pill px-2"
                        onClick={() => handleOpenEdit(pet)}
                        disabled={actionLoading}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-pill px-2"
                        onClick={() => handleDelete(pet.id, pet.name)}
                        disabled={actionLoading}
                      >
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* MODAL BIỂU MẪU THÊM / SỬA (QUẢN LÝ BỞI FORMIK & YUP) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" backdrop="static">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold">
            {editingPet ? `Chỉnh Sửa Thông Tin: ${editingPet.name}` : 'Thêm Bé Thú Cưng Mới'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body className="px-4 py-3">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Tên thú cưng *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Ví dụ: Bim Bim"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.name && !!formik.errors.name}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Giống loài *</Form.Label>
                  <Form.Control
                    type="text"
                    name="breed"
                    placeholder="Ví dụ: Golden Retriever"
                    value={formik.values.breed}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.breed && !!formik.errors.breed}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.breed}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Phân loại *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.category && !!formik.errors.category}
                  >
                    <option value="Dogs">Chó Cưng (Dogs)</option>
                    <option value="Cats">Mèo Con (Cats)</option>
                    <option value="Birds">Chim Cảnh (Birds)</option>
                    <option value="Rabbits">Thỏ Con (Rabbits)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Phí nhận nuôi ($) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="Ví dụ: 120"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.price && !!formik.errors.price}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.price}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Độ tuổi *</Form.Label>
                  <Form.Control
                    type="text"
                    name="age"
                    placeholder="Ví dụ: 3 months"
                    value={formik.values.age}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.age && !!formik.errors.age}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.age}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Xuất xứ *</Form.Label>
                  <Form.Control
                    type="text"
                    name="origin"
                    placeholder="Ví dụ: Scotland"
                    value={formik.values.origin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.origin && !!formik.errors.origin}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.origin}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Màu lông *</Form.Label>
                  <Form.Control
                    type="text"
                    name="color"
                    placeholder="Ví dụ: Vàng kim"
                    value={formik.values.color}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.color && !!formik.errors.color}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.color}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Đánh giá sức khỏe (1-5 sao) *</Form.Label>
                  <Form.Select
                    name="rating"
                    value={formik.values.rating}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value={5}>5 Sao - Xuất sắc</option>
                    <option value={4}>4 Sao - Khỏe mạnh</option>
                    <option value={3}>3 Sao - Bình thường</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* URL HÌNH ẢNH */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Đường dẫn hình ảnh (URL) *</Form.Label>
              <Form.Control
                type="text"
                name="image"
                placeholder="https://images.unsplash.com/..."
                value={formik.values.image}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.image && !!formik.errors.image}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.image}</Form.Control.Feedback>
            </Form.Group>

            {/* MÔ TẢ CHI TIẾT */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Tính cách & Mô tả chi tiết *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Bé rất hoạt bát, thích quấn người, ăn khỏe..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.description && !!formik.errors.description}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.description}</Form.Control.Feedback>
            </Form.Group>

            {/* CÁC THUỘC TÍNH CHECKBOX */}
            <div className="d-flex gap-4 p-2 bg-light rounded-3">
              <Form.Check
                type="checkbox"
                id="isVaccinatedCheck"
                name="isVaccinated"
                label="Đã tiêm chủng vắc-xin"
                checked={formik.values.isVaccinated}
                onChange={formik.handleChange}
              />
              <Form.Check
                type="checkbox"
                id="isSpecialCheck"
                name="isSpecial"
                label="Giống thuần chủng quý hiếm"
                checked={formik.values.isSpecial}
                onChange={formik.handleChange}
              />
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={actionLoading}>
              Hủy Bỏ
            </Button>
            <Button type="submit" variant="primary" disabled={actionLoading} className="fw-bold">
              {actionLoading ? 'Đang xử lý...' : editingPet ? 'Cập Nhật Thú Cưng' : 'Lưu Thú Cưng Mới'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default AdminDashboard;
