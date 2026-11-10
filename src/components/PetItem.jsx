// src/components/PetItem.jsx
import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * =========================================================================
 * COMPONENT THẺ THÚ CƯNG (PET CARD ITEM)
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. Props: Nhận pet, onSelect (Mở modal), onAddPet (Gọi useReducer).
 * 2. React Router: Thẻ Button as={Link} chuyển hướng sang trang chi tiết /pets/:id.
 * 3. Conditional Rendering (Render có điều kiện): Hiển thị Badge Tiêm chủng, Giống quý hiếm.
 * =========================================================================
 */
function PetItem({ pet, onSelect, onAddPet }) {
  return (
    <Card className="h-100 shadow-sm border-0 pet-card">
      {/* VÙNG HÌNH ẢNH & BADGES */}
      <div className="pet-card-img-container position-relative">
        <Card.Img
          variant="top"
          src={pet.image}
          alt={pet.name}
          className="pet-card-img"
        />

        {/* Badge Giống quý hiếm (Góc trên trái) */}
        {pet.isSpecial && (
          <div className="badge-overlay-top-left">
            <Badge bg="danger" className="shadow-sm">
              Giống Quý
            </Badge>
          </div>
        )}

        {/* Badge Tiêm chủng (Góc trên phải) */}
        <div className="badge-overlay-top-right">
          {pet.isVaccinated ? (
            <Badge bg="success" className="shadow-sm">
              Đã tiêm phòng
            </Badge>
          ) : (
            <Badge bg="secondary" className="shadow-sm">
              Chưa tiêm
            </Badge>
          )}
        </div>
      </div>

      {/* VÙNG THÔNG TIN CHI TIẾT */}
      <Card.Body className="d-flex flex-column justify-content-between p-3">
        <div>
          <div className="d-flex justify-content-between align-items-start mb-1">
            <Card.Title className="fw-bold mb-0 text-primary">{pet.name}</Card.Title>
            <span className="text-success fw-bold fs-5">${pet.price}</span>
          </div>

          <Card.Subtitle className="text-muted small mb-2">
            {pet.breed}
          </Card.Subtitle>

          <div className="small mb-2 text-secondary">
            <div>Xuất xứ: <span className="fw-semibold text-dark">{pet.origin}</span></div>
            <div>Độ tuổi: <span className="fw-semibold text-dark">{pet.age}</span></div>
          </div>

          {/* Đánh giá sao */}
          <div className="small mb-3">
            <span className="text-warning">{'★'.repeat(pet.rating || 5)}</span>{' '}
            <span className="text-muted">({pet.rating || 5}/5)</span>
          </div>
        </div>

        {/* CÁC NÚT HÀNH ĐỘNG */}
        <div className="d-flex flex-column gap-2 mt-auto">
          <div className="d-flex gap-2">
            {/* Nút Xem Nhanh: Kích hoạt Modal qua Hook useState ở Container */}
            {onSelect && (
              <Button
                variant="outline-secondary"
                size="sm"
                className="w-50"
                onClick={() => onSelect(pet)}
              >
                Xem Nhanh
              </Button>
            )}

            {/* Nút Chi Tiết: Dẫn tới Route /pets/:id (React Router) */}
            <Button
              as={Link}
              to={`/pets/${pet.id}`}
              variant="outline-primary"
              size="sm"
              className={onSelect ? 'w-50' : 'w-100'}
            >
              Chi Tiết
            </Button>
          </div>

          {/* Nút Nhận Nuôi: Thêm bé vào giỏ useReducer */}
          {onAddPet && (
            <Button
              variant="warning"
              size="sm"
              className="w-100 fw-bold text-dark shadow-sm"
              onClick={() => onAddPet(pet)}
            >
              Đăng Ký Nhận Nuôi
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default PetItem;
