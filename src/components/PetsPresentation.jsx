// src/components/PetsPresentation.jsx
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import PetItem from './PetItem';

/**
 * =========================================================================
 * COMPONENT TRÌNH BÀY (PRESENTATIONAL COMPONENT)
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. Container - Presentation Pattern: Tách biệt việc quản lý dữ liệu (Container)
 *    và việc hiển thị giao diện (Presentation).
 * 2. Pure Component: Nhận mảng pets và các hàm callback qua props để render danh sách.
 * =========================================================================
 */
function PetsPresentation({ pets, onSelectPet, onAddPet }) {
  if (!pets || pets.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <h4>Không tìm thấy bé thú cưng nào phù hợp với yêu cầu tìm kiếm!</h4>
        <p>Vui lòng thử lại với từ khóa hoặc danh mục khác.</p>
      </div>
    );
  }

  return (
    <Row className="g-4">
      {pets.map((pet) => (
        <Col key={pet.id} xs={12} sm={6} md={4} lg={3}>
          <PetItem
            pet={pet}
            onSelect={onSelectPet}
            onAddPet={onAddPet}
          />
        </Col>
      ))}
    </Row>
  );
}

export default PetsPresentation;
