// src/components/PetDetailModal.jsx
import React from 'react';
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap';

/**
 * =========================================================================
 * MODAL XEM NHANH THÚ CƯNG (QUICK VIEW MODAL)
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. React Bootstrap Modal: Điều khiển đóng/mở linh hoạt qua State.
 * 2. Props: Nhận pet đang chọn, cờ boolean show và hàm callback onHide.
 * =========================================================================
 */
function PetDetailModal({ pet, show, onHide, onAddPet }) {
  if (!pet) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold text-primary">
          Thông Tin Bé: {pet.name}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <Row className="g-4 align-items-center">
          <Col md={5}>
            <img
              src={pet.image}
              alt={pet.name}
              className="img-fluid rounded-3 shadow-sm w-100"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
            />
          </Col>

          <Col md={7}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4 className="fw-bold mb-0 text-dark">{pet.name}</h4>
              <span className="text-success fw-bold fs-4">${pet.price}</span>
            </div>

            <p className="text-muted mb-3">Giống loài: <strong className="text-primary">{pet.breed}</strong></p>

            <div className="d-flex gap-2 mb-3">
              {pet.isVaccinated ? (
                <Badge bg="success">Đã tiêm phòng đầy đủ</Badge>
              ) : (
                <Badge bg="secondary">Chưa tiêm phòng</Badge>
              )}
              {pet.isSpecial && <Badge bg="danger">Giống quý hiếm</Badge>}
              <Badge bg="info" className="text-dark">Phân loại: {pet.category}</Badge>
            </div>

            <div className="small mb-3">
              <div><strong>Xuất xứ:</strong> {pet.origin}</div>
              <div><strong>Màu lông:</strong> {pet.color}</div>
              <div><strong>Độ tuổi:</strong> {pet.age}</div>
              <div><strong>Đánh giá sức khỏe:</strong> <span className="text-warning">{'★'.repeat(pet.rating || 5)}</span> ({pet.rating || 5}/5)</div>
            </div>

            <hr />
            <p className="text-secondary small fst-italic mb-0">
              "{pet.description}"
            </p>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Đóng
        </Button>
        {onAddPet && (
          <Button
            variant="warning"
            className="fw-bold text-dark"
            onClick={() => {
              onAddPet(pet);
              onHide(); // Tự động đóng modal sau khi thêm
            }}
          >
            Thêm Vào Đơn Nhận Nuôi
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default PetDetailModal;
