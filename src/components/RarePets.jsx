// src/components/RarePets.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { getAllPets } from '../services/petService';
import PetItem from './PetItem';
import PetDetailModal from './PetDetailModal';

/**
 * =========================================================================
 * TRANG GIỐNG THÚ CƯNG QUÝ HIẾM (RARE & SPECIAL PETS)
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. Fetch API từ MockAPI: Dữ liệu động hoàn toàn, không hardcode.
 * 2. Array.filter: Lọc ra các bé có isSpecial === true.
 * 3. Tái sử dụng component PetItem và PetDetailModal.
 * =========================================================================
 */
function RarePets({ onAddPet }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchRarePets = async () => {
    try {
      setLoading(true);
      setError(null);
      const allPets = await getAllPets();
      // Lọc các bé có thuộc tính isSpecial === true
      const rareList = allPets.filter((pet) => pet.isSpecial === true || pet.isSpecial === 'true');
      setPets(rareList);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải danh sách thú cưng quý hiếm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRarePets();
  }, []);

  return (
    <Container className="py-4">
      <div className="text-center mb-4 p-4 rounded-4 bg-warning bg-opacity-10 border border-warning shadow-sm">
        <h2 className="fw-bold text-dark mb-2">Bộ Sưu Tập Thú Cưng Quý Hiếm</h2>
        <p className="text-secondary mb-0">
          Tuyển chọn những bé thuần chủng, có phả hệ gia phả rõ ràng và đặc tính thông minh vượt trội
        </p>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="warning" />
          <p className="mt-3 text-muted">Đang tải danh sách thú cưng quý hiếm...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          <h5>Lỗi kết nối!</h5>
          <p>{error}</p>
        </Alert>
      )}

      {!loading && !error && (
        <>
          {pets.length === 0 ? (
            <div className="text-center py-5 text-muted">
              Hiện chưa có bé thú cưng quý hiếm nào trong cơ sở dữ liệu.
            </div>
          ) : (
            <Row className="g-4">
              {pets.map((pet) => (
                <Col key={pet.id} xs={12} sm={6} md={4} lg={3}>
                  <PetItem
                    pet={pet}
                    onSelect={(item) => {
                      setSelectedPet(item);
                      setShowModal(true);
                    }}
                    onAddPet={onAddPet}
                  />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      <PetDetailModal
        pet={selectedPet}
        show={showModal}
        onHide={() => setShowModal(false)}
        onAddPet={onAddPet}
      />
    </Container>
  );
}

export default RarePets;
