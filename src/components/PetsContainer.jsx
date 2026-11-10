// src/components/PetsContainer.jsx
import React, { useState, useEffect } from 'react';
import { Container, Form, InputGroup, ButtonGroup, Button, Spinner, Alert } from 'react-bootstrap';
import { getAllPets } from '../services/petService';
import PetsPresentation from './PetsPresentation';
import PetDetailModal from './PetDetailModal';

/**
 * =========================================================================
 * CONTAINER COMPONENT: QUẢN LÝ DỮ LIỆU & LỌC TÌM KIẾM THÚ CƯNG
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. React Hook useState: Quản lý danh sách pets, loading, error, modal, search, category.
 * 2. Effect Hook (useEffect): Gọi Fetch API từ MockAPI khi component Mount.
 * 3. Derived State: Lọc kết hợp cả từ khóa (Search) và Danh mục (Category Tabs).
 * =========================================================================
 */
function PetsContainer({ onAddPet }) {
  // 1. Quản lý State dữ liệu và trạng thái gọi mạng
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. State điều khiển bộ lọc
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  // 3. State phục vụ Modal Xem Nhanh
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Danh sách các danh mục thú cưng
  const categories = [
    { key: 'ALL', label: 'Tất Cả' },
    { key: 'Dogs', label: 'Chó Cưng' },
    { key: 'Cats', label: 'Mèo Con' },
    { key: 'Birds', label: 'Chim Cảnh' },
    { key: 'Rabbits', label: 'Thỏ Con' }
  ];

  // Hàm gọi API lấy danh sách
  const fetchPetsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPets();
      setPets(data);
    } catch (err) {
      setError(err.message || 'Lỗi kết nối tới máy chủ MockAPI');
    } finally {
      setLoading(false);
    }
  };

  // 4. Hook useEffect: Chỉ chạy 1 lần khi Component Mount để nạp dữ liệu
  useEffect(() => {
    fetchPetsData();
  }, []);

  // Mở modal xem nhanh
  const handleOpenModal = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  // 5. Derived State: Lọc dữ liệu kết hợp cả Tên/Giống và Danh mục
  const filteredPets = pets.filter((pet) => {
    const matchesCategory =
      activeCategory === 'ALL' || pet.category === activeCategory;

    const matchesSearch =
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <Container className="py-4">
      {/* HERO BANNER GIỚI THIỆU */}
      <div className="text-center mb-4 p-4 rounded-4 bg-primary bg-opacity-10 shadow-sm">
        <h1 className="fw-bold text-primary mb-2">Chào Mừng Đến Với Pet Haven</h1>
        <p className="text-muted mb-0 fs-5">
          Ngôi nhà chung kết nối yêu thương, tìm kiếm mái ấm hạnh phúc cho những bé thú cưng đáng yêu
        </p>
      </div>

      {/* THANH TÌM KIẾM & BỘ LỌC DANH MỤC */}
      <div className="mb-4 d-flex flex-column align-items-center gap-3">
        {/* Ô Tìm Kiếm theo tên hoặc giống loài */}
        <div style={{ maxWidth: '550px', width: '100%' }}>
          <InputGroup className="shadow-sm">
            <InputGroup.Text className="bg-white text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
              </svg>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Tìm bé theo tên (Bim Bim, Miu Miu...) hoặc giống loài (Golden, Corgi...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button variant="outline-secondary" onClick={() => setSearchQuery('')}>
                ✕
              </Button>
            )}
          </InputGroup>
        </div>

        {/* Các nút bấm chọn danh mục (Category Tabs) */}
        <ButtonGroup className="flex-wrap shadow-sm">
          {categories.map((cat) => (
            <Button
              key={cat.key}
              variant={activeCategory === cat.key ? 'warning' : 'outline-primary'}
              className="fw-semibold px-3 py-2"
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* 1. TRẠNG THÁI LOADING (SPINNER) */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="warning" role="status" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted fw-semibold">Đang tải danh sách thú cưng từ MockAPI...</p>
        </div>
      )}

      {/* 2. TRẠNG THÁI ERROR (ALERT) */}
      {error && (
        <Alert variant="danger" className="text-center shadow-sm">
          <h5>Không thể kết nối với MockAPI!</h5>
          <p className="mb-2">{error}</p>
          <Button variant="outline-danger" size="sm" onClick={fetchPetsData}>
            Thử Tải Lại
          </Button>
        </Alert>
      )}

      {/* 3. HIỂN THỊ DANH SÁCH THÚ CƯNG QUA PRESENTATION COMPONENT */}
      {!loading && !error && (
        <PetsPresentation
          pets={filteredPets}
          onSelectPet={handleOpenModal}
          onAddPet={onAddPet}
        />
      )}

      {/* MODAL QUICK VIEW */}
      <PetDetailModal
        pet={selectedPet}
        show={showModal}
        onHide={() => setShowModal(false)}
        onAddPet={onAddPet}
      />
    </Container>
  );
}

export default PetsContainer;
