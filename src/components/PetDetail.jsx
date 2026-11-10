// src/components/PetDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { getPetById } from '../services/petService';

/**
 * =========================================================================
 * TRANG CHI TIẾT THÚ CƯNG (PET DETAIL PAGE)
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. React Router useParams(): Lấy tham số động :id từ thanh URL (/pets/:id).
 * 2. React Router useNavigate(): Nút bấm Quay lại (navigate(-1) hoặc navigate('/')).
 * 3. useEffect lắng nghe [id]: Tự động gọi API lấy chi tiết mỗi khi id trên URL thay đổi.
 * 4. Xử lý 3 trạng thái bất đồng bộ: Loading, Error (nếu nhập sai ID), Success.
 * =========================================================================
 */
function PetDetail({ onAddPet }) {
  // 1. Hook useParams trích xuất id từ đường dẫn URL (kiểu dữ liệu là String)
  const { id } = useParams();
  const navigate = useNavigate();

  // 2. Các State quản lý dữ liệu bé thú cưng
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Effect Hook: Tự động tải dữ liệu mỗi khi biến id thay đổi
  useEffect(() => {
    const fetchPetDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        // Gọi hàm getPetById từ tầng Service
        const data = await getPetById(id);
        setPet(data);
      } catch (err) {
        setError(err.message || 'Không tìm thấy bé thú cưng này');
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetail();
  }, [id]); // Dependency array lắng nghe sự thay đổi của id

  // 1. TRẠNG THÁI LOADING
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 text-muted">Đang truy vấn hồ sơ bé thú cưng từ MockAPI...</p>
      </Container>
    );
  }

  // 2. TRẠNG THÁI LỖI (Ví dụ người dùng tự gõ ID không tồn tại lên URL)
  if (error || !pet) {
    return (
      <Container className="py-5 text-center" style={{ maxWidth: '600px' }}>
        <Alert variant="danger" className="shadow-sm">
          <h4>Không Tìm Thấy Thú Cưng!</h4>
          <p>{error || 'Bé thú cưng với ID này không tồn tại trong hệ thống.'}</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Quay Về Trang Chủ
          </Button>
        </Alert>
      </Container>
    );
  }

  // 3. TRẠNG THÁI THÀNH CÔNG: HIỂN THỊ HỒ SƠ CHI TIẾT
  return (
    <Container className="py-5">
      {/* Nút quay lại trang trước đó */}
      <Button variant="outline-secondary" className="mb-4 rounded-pill" onClick={() => navigate(-1)}>
        ← Quay Lại
      </Button>

      <Card className="shadow border-0 overflow-hidden rounded-4">
        <Row className="g-0">
          {/* CỘT TRÁI: HÌNH ẢNH LỚN */}
          <Col lg={5}>
            <img
              src={pet.image}
              alt={pet.name}
              className="w-100 h-100"
              style={{ objectFit: 'cover', minHeight: '400px' }}
            />
          </Col>

          {/* CỘT PHẢI: HỒ SƠ CHI TIẾT & SỨC KHỎE */}
          <Col lg={7}>
            <Card.Body className="p-4 p-md-5 d-flex flex-column justify-content-between">
              <div>
                {/* Các Badge nổi bật */}
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <Badge bg="primary" className="fs-6 px-3 py-2">
                    Loài: {pet.category}
                  </Badge>
                  {pet.isSpecial && (
                    <Badge bg="danger" className="fs-6 px-3 py-2">
                      Giống Thuần Chủng Quý Hiếm
                    </Badge>
                  )}
                  {pet.isVaccinated ? (
                    <Badge bg="success" className="fs-6 px-3 py-2">
                      Đã Tiêm Phòng Đầy Đủ
                    </Badge>
                  ) : (
                    <Badge bg="secondary" className="fs-6 px-3 py-2">
                      Đang Chờ Tiêm Mũi 1
                    </Badge>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h1 className="fw-bold text-primary mb-0">{pet.name}</h1>
                  <span className="text-success fw-bold fs-2">${pet.price}</span>
                </div>

                <h5 className="text-muted mb-4">{pet.breed}</h5>

                {/* Bảng tóm tắt thông số sức khỏe & lai lịch */}
                <ListGroup variant="flush" className="mb-4 rounded-3 border">
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span className="text-muted">Xuất xứ / Nguồn gốc:</span>
                    <strong className="text-dark">{pet.origin}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span className="text-muted">Màu sắc lông:</span>
                    <strong className="text-dark">{pet.color}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span className="text-muted">Độ tuổi:</span>
                    <strong className="text-dark">{pet.age}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span className="text-muted">Đánh giá thể trạng:</span>
                    <span className="text-warning fw-bold">
                      {'★'.repeat(pet.rating || 5)} ({pet.rating || 5}/5)
                    </span>
                  </ListGroup.Item>
                </ListGroup>

                <h6 className="fw-bold text-dark">Tính cách & Mô tả chi tiết:</h6>
                <p className="text-secondary leading-relaxed mb-4">
                  {pet.description || 'Chưa có thông tin mô tả chi tiết cho bé thú cưng này.'}
                </p>
              </div>

              {/* Nút nhận nuôi */}
              {onAddPet && (
                <Button
                  variant="warning"
                  size="lg"
                  className="w-100 fw-bold text-dark shadow py-3 rounded-pill"
                  onClick={() => onAddPet(pet)}
                >
                  Đăng Ký Nhận Nuôi Bé {pet.name}
                </Button>
              )}
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default PetDetail;
