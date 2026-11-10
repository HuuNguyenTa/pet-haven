// src/components/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPets } from '../services/petService';
import PetItem from './PetItem';
import PetDetailModal from './PetDetailModal';
import heroImg from '../assets/hero.jpg';

/**
 * =========================================================================
 * LANDING PAGE DÀNH CHO GUEST & NGƯỜI DÙNG KHI MỚI VÀO HỆ THỐNG
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. UI/UX hiện đại: Hero banner, Stats, Tính năng nổi bật, Quy trình nhận nuôi.
 * 2. Phân nhánh hành vi người dùng (Guest vs Logged In User vs Admin).
 * 3. Tái sử dụng PetItem, PetDetailModal và kết nối API lấy thú cưng tiêu biểu.
 * =========================================================================
 */
function LandingPage({ onAddPet }) {
  const { user, isAdmin } = useAuth();
  const [featuredPets, setFeaturedPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Tải danh sách thú cưng nổi bật (lấy 4 bé có isSpecial hoặc 4 bé đầu tiên)
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const allPets = await getAllPets();
        const specials = allPets.filter((p) => p.isSpecial === true || p.isSpecial === 'true');
        setFeaturedPets(specials.length >= 4 ? specials.slice(0, 4) : allPets.slice(0, 4));
      } catch {
        // Dự phòng nếu API gặp sự cố
        setFeaturedPets([]);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="landing-page">
      {/* 1. HERO SECTION */}
      <section className="py-5 bg-primary bg-opacity-10 border-bottom">
        <Container>
          <Row className="align-items-center g-5 py-4">
            <Col lg={7}>
              <Badge bg="warning" text="dark" className="px-3 py-2 fs-6 mb-3 rounded-pill fw-bold">
                Nền Tảng Bảo Trợ & Nhận Nuôi Thú Cưng Hàng Đầu
              </Badge>
              <h1 className="display-4 fw-bold text-primary mb-3">
                Tìm Kiếm Mái Ấm Yêu Thương Cho Những Bé Thú Cưng
              </h1>
              <p className="lead text-secondary mb-4">
                Pet Haven kết nối những trái tim nhân ái với hàng trăm bé chó, mèo và thú cảnh đang tìm kiếm một mái nhà bình yên. 100% các bé đều được tiêm phòng, kiểm tra sức khỏe toàn diện trước khi về với bạn.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Button
                  as={Link}
                  to={user ? "/pets" : "/login"}
                  variant="warning"
                  size="lg"
                  className="rounded-pill px-4 fw-bold shadow-sm"
                >
                  Khám Phá Thú Cưng Ngay
                </Button>

                {!user ? (
                  <>
                    <Button
                      as={Link}
                      to="/login"
                      variant="outline-primary"
                      size="lg"
                      className="rounded-pill px-4 fw-bold"
                    >
                      Đăng Nhập
                    </Button>
                    <Button
                      as={Link}
                      to="/register"
                      variant="primary"
                      size="lg"
                      className="rounded-pill px-4 fw-bold"
                    >
                      Đăng Ký Thành Viên
                    </Button>
                  </>
                ) : isAdmin ? (
                  <Button
                    as={Link}
                    to="/admin"
                    variant="outline-danger"
                    size="lg"
                    className="rounded-pill px-4 fw-bold"
                  >
                    Khu Vực Quản Trị (Admin)
                  </Button>
                ) : (
                  <Button
                    as={Link}
                    to="/adoption"
                    variant="outline-primary"
                    size="lg"
                    className="rounded-pill px-4 fw-bold"
                  >
                    Xem Đơn Nhận Nuôi
                  </Button>
                )}
              </div>
            </Col>

            <Col lg={5} className="text-center">
              <div className="position-relative p-2 bg-white rounded-5 shadow-lg border">
                <img
                  src={heroImg}
                  alt="Pet Haven Hero"
                  className="img-fluid rounded-4 w-100"
                  style={{ maxHeight: '420px', objectFit: 'cover' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2. STATS SECTION (CON SỐ ẤN TƯỢNG) */}
      <section className="py-4 bg-white border-bottom shadow-sm">
        <Container>
          <Row className="text-center g-4">
            <Col xs={6} md={3}>
              <h2 className="fw-bold text-primary display-6 mb-1">1,200+</h2>
              <p className="text-muted mb-0 fw-semibold">Thú Cưng Tìm Được Nhà</p>
            </Col>
            <Col xs={6} md={3}>
              <h2 className="fw-bold text-success display-6 mb-1">100%</h2>
              <p className="text-muted mb-0 fw-semibold">Tiêm Phòng Đầy Đủ</p>
            </Col>
            <Col xs={6} md={3}>
              <h2 className="fw-bold text-warning display-6 mb-1">98%</h2>
              <p className="text-muted mb-0 fw-semibold">Gia Đình Hài Lòng</p>
            </Col>
            <Col xs={6} md={3}>
              <h2 className="fw-bold text-info display-6 mb-1">24/7</h2>
              <p className="text-muted mb-0 fw-semibold">Tư Vấn Thú Y Hậu Nhận Nuôi</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 3. TẠI SAO NÊN CHỌN PET HAVEN (FEATURES) */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-primary mb-2">Giá Trị Cốt Lõi Của Pet Haven</h2>
            <p className="text-muted" style={{ maxWidth: '650px', margin: '0 auto' }}>
              Chúng tôi xây dựng quy trình bảo trợ khép kín, minh bạch và an toàn nhằm mang lại cuộc sống tốt nhất cho cả người nuôi và thú cưng.
            </p>
          </div>

          <Row className="g-4">
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm rounded-4 p-3 text-center">
                <Card.Body>
                  <div className="badge bg-primary bg-opacity-10 text-primary p-3 rounded-circle mb-3 fs-4 fw-bold">
                    01
                  </div>
                  <Card.Title className="fw-bold text-primary mb-2">Sức Khỏe Đảm Bảo</Card.Title>
                  <Card.Text className="text-muted small">
                    Mọi bé thú cưng đều được kiểm tra thú y tổng quát, tẩy giun và hoàn thành các mũi tiêm vắc-xin cần thiết.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm rounded-4 p-3 text-center">
                <Card.Body>
                  <div className="badge bg-success bg-opacity-10 text-success p-3 rounded-circle mb-3 fs-4 fw-bold">
                    02
                  </div>
                  <Card.Title className="fw-bold text-success mb-2">Hồ Sơ Minh Bạch</Card.Title>
                  <Card.Text className="text-muted small">
                    Thông tin về nguồn gốc, độ tuổi, màu lông, tính cách và phả hệ của từng bé được công khai rõ ràng.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm rounded-4 p-3 text-center">
                <Card.Body>
                  <div className="badge bg-warning bg-opacity-10 text-warning p-3 rounded-circle mb-3 fs-4 fw-bold">
                    03
                  </div>
                  <Card.Title className="fw-bold text-dark mb-2">Thủ Tục Nhanh Chóng</Card.Title>
                  <Card.Text className="text-muted small">
                    Đăng ký trực tuyến với quy trình xác thực Formik & Yup chặt chẽ, duyệt hồ sơ trong vòng 24 giờ.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm rounded-4 p-3 text-center">
                <Card.Body>
                  <div className="badge bg-info bg-opacity-10 text-info p-3 rounded-circle mb-3 fs-4 fw-bold">
                    04
                  </div>
                  <Card.Title className="fw-bold text-info mb-2">Hỗ Trợ Trọn Đời</Card.Title>
                  <Card.Text className="text-muted small">
                    Đội ngũ cộng đồng và bác sĩ thú y đồng hành hướng dẫn dinh dưỡng, huấn luyện và chăm sóc trọn đời.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 4. THÚ CƯNG TIÊU BIỂU (FEATURED PETS PREVIEW) */}
      {featuredPets.length > 0 && (
        <section className="py-5 bg-white">
          <Container>
            <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
              <div>
                <h2 className="fw-bold text-primary mb-1">Những Bé Đang Chờ Mái Ấm Mới</h2>
                <p className="text-muted mb-0">Tuyển chọn các bé khỏe mạnh, đáng yêu và sẵn sàng về nhà mới</p>
              </div>
              <Button as={Link} to={user ? "/pets" : "/login"} variant="outline-primary" className="rounded-pill fw-semibold mt-3 mt-md-0">
                Xem Toàn Bộ Thú Cưng &rarr;
              </Button>
            </div>

            <Row className="g-4">
              {featuredPets.map((pet) => (
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
          </Container>
        </section>
      )}

      {/* 5. QUY TRÌNH 4 BƯỚC NHẬN NUÔI */}
      <section className="py-5 bg-light border-top">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-primary mb-2">Quy Trình Nhận Nuôi Đơn Giản</h2>
            <p className="text-muted" style={{ maxWidth: '650px', margin: '0 auto' }}>
              Chỉ với 4 bước đơn giản, bạn đã có thể đón một người bạn trung thành về với tổ ấm của mình.
            </p>
          </div>

          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 border-start border-4 border-primary">
                <span className="badge bg-primary mb-3">Bước 1</span>
                <h5 className="fw-bold text-dark">Khám Phá Thú Cưng</h5>
                <p className="text-muted small mb-0">
                  Dạo xem hồ sơ các bé trên website, lọc theo loài (chó, mèo, chim, thỏ) và xem chi tiết tính cách.
                </p>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 border-start border-4 border-warning">
                <span className="badge bg-warning text-dark mb-3">Bước 2</span>
                <h5 className="fw-bold text-dark">Điền Đơn Đăng Ký</h5>
                <p className="text-muted small mb-0">
                  Thêm bé vào danh sách và điền thông tin người nhận nuôi, không gian sống và kinh nghiệm chăm sóc.
                </p>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 border-start border-4 border-info">
                <span className="badge bg-info text-dark mb-3">Bước 3</span>
                <h5 className="fw-bold text-dark">Xác Nhận & Tư Vấn</h5>
                <p className="text-muted small mb-0">
                  Chuyên viên Pet Haven liên hệ trao đổi, hướng dẫn chuẩn bị phụ kiện và sắp xếp lịch đón bé.
                </p>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 border-start border-4 border-success">
                <span className="badge bg-success mb-3">Bước 4</span>
                <h5 className="fw-bold text-dark">Đón Bé Về Nhà</h5>
                <p className="text-muted small mb-0">
                  Ký bản cam kết yêu thương, nhận sổ theo dõi sức khỏe và chính thức bắt đầu hành trình mới cùng bé.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-5 bg-primary text-white text-center">
        <Container style={{ maxWidth: '800px' }}>
          <h2 className="display-6 fw-bold mb-3">Sẵn Sàng Trao Đi Yêu Thương?</h2>
          <p className="lead opacity-90 mb-4">
            Mỗi lượt nhận nuôi là một cuộc đời được cứu rỗi. Hãy cùng chúng tôi mở rộng vòng tay cho các bé cơ hội sống trong hạnh phúc.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button
              as={Link}
              to={user ? "/pets" : "/login"}
              variant="warning"
              size="lg"
              className="rounded-pill px-4 fw-bold shadow"
            >
              Xem Danh Sách Thú Cưng
            </Button>
            {!user && (
              <Button
                as={Link}
                to="/register"
                variant="outline-light"
                size="lg"
                className="rounded-pill px-4 fw-bold"
              >
                Tạo Tài Khoản Mới
              </Button>
            )}
          </div>
        </Container>
      </section>

      {/* Quick view modal */}
      <PetDetailModal
        pet={selectedPet}
        show={showModal}
        onHide={() => setShowModal(false)}
        onAddPet={onAddPet}
      />
    </div>
  );
}

export default LandingPage;
