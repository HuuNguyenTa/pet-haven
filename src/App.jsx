// src/App.jsx
import React, { useReducer, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

// 1. Tầng Quản lý Ngữ cảnh (Context Hooks)
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// 2. Tầng Quản lý Trạng thái phức tạp (useReducer)
import { adoptionReducer, initialAdoptionState } from './reducers/adoptionReducer';

// 3. Các Components Giao diện chính
import NavigationBar from './components/Navbar';
import LandingPage from './components/LandingPage';
import PetsContainer from './components/PetsContainer';
import PetDetail from './components/PetDetail';
import RarePets from './components/RarePets';
import AdoptionCart from './components/AdoptionCart';
import AdoptionForm from './components/AdoptionForm';
import AdoptionSuccess from './components/AdoptionSuccess';
import ContactForm from './components/ContactForm';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * =========================================================================
 * MAIN APP COMPONENT: NƠI KẾT NỐI TOÀN BỘ KIẾN THỨC REACT
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. useTheme(): Đồng bộ màu nền Dark/Light toàn ứng dụng.
 * 2. useReducer(): Quản lý giỏ đơn nhận nuôi thú cưng (cart, dispatch).
 * 3. useState(): Quản lý hồ sơ đơn hoàn tất (completedOrder).
 * 4. React Router v6/v7: Định tuyến đa trang SPA:
 *    - /: Landing Page cho Guest và người dùng mới vào
 *    - /pets: Danh mục toàn bộ thú cưng (PetsContainer)
 *    - /rare-pets: Thú cưng quý hiếm
 *    - /pets/:id: Chi tiết từng bé
 *    - /adoption: Giỏ nhận nuôi và thanh toán
 *    - /contact: Biểu mẫu liên hệ Formik & Yup
 *    - /login & /register: Đăng nhập & Đăng ký xác thực
 *    - /admin: Bảng điều khiển CRUD riêng biệt cho Quản trị viên (Protected Route)
 * =========================================================================
 */
function MainApp() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Hook useReducer quản lý danh sách nhận nuôi
  const [cart, dispatch] = useReducer(adoptionReducer, initialAdoptionState);

  // 2. Hook useState lưu kết quả đơn đăng ký thành công
  const [completedOrder, setCompletedOrder] = useState(null);

  // Hàm xử lý khi người dùng bấm nút "Đăng Ký Nhận Nuôi" tại bất kỳ đâu
  const handleAddPetToCart = (pet) => {
    if (!user) {
      alert('Vui lòng đăng nhập tài khoản để nhận nuôi thú cưng!');
      navigate('/login');
      return;
    }
    dispatch({ type: 'ADD_PET', payload: pet });
    alert(`Đã thêm bé "${pet.name}" vào danh sách đăng ký nhận nuôi!`);
  };

  // Hàm xử lý khi người dùng submit biểu mẫu nhận nuôi
  const handleAdoptionSubmit = (customerInfo) => {
    const totalMonths = cart.reduce((sum, item) => sum + item.months, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.months, 0);

    // Lưu vào state để hiển thị trang xác nhận hoàn tất
    setCompletedOrder({
      customerInfo,
      items: [...cart],
      totalMonths,
      totalPrice
    });

    // Làm rỗng giỏ sau khi submit thành công
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <div
      data-bs-theme={theme}
      className={`min-vh-100 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}
      style={{ transition: 'background-color 0.3s ease, color 0.3s ease' }}
    >
      {/* THANH ĐIỀU HƯỚNG CHUNG: tính tổng số tháng của tất cả các bé có trong giỏ hàng */}
      <NavigationBar cartCount={cart.reduce((sum, item) => sum + item.months, 0)} />

      <main className="pb-5">
        {/* HỆ THỐNG ĐỊNH TUYẾN (REACT ROUTER) */}
        <Routes>
          {/* 1. Trang chủ dành cho Guest & Người dùng mới: Landing Page */}
          <Route path="/" element={<LandingPage onAddPet={handleAddPetToCart} />} />

          {/* 2. Các trang chỉ xem được KHI ĐÃ ĐĂNG NHẬP (Role User) */}
          <Route
            path="/pets"
            element={
              <ProtectedRoute>
                <PetsContainer onAddPet={handleAddPetToCart} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rare-pets"
            element={
              <ProtectedRoute>
                <RarePets onAddPet={handleAddPetToCart} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pets/:id"
            element={
              <ProtectedRoute>
                <PetDetail onAddPet={handleAddPetToCart} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/adoption"
            element={
              <ProtectedRoute>
                <Container className="py-4">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-warning">Đăng Ký Thủ Tục Nhận Nuôi Thú Cưng</h2>
                    <p className="text-muted">
                      Kiểm tra danh sách thú cưng và điền thông tin để hoàn tất hồ sơ nhận nuôi
                    </p>
                  </div>

                  {completedOrder ? (
                    /* Nếu đã gửi đơn thành công: Hiện trang xác nhận */
                    <AdoptionSuccess
                      order={completedOrder}
                      onReset={() => setCompletedOrder(null)}
                    />
                  ) : (
                    /* Nếu chưa gửi: Hiện bảng danh sách + Form Formik Yup */
                    <Row className="g-4">
                      <Col lg={7}>
                        <AdoptionCart cart={cart} dispatch={dispatch} />
                      </Col>
                      <Col lg={5}>
                        <AdoptionForm
                          isCartEmpty={cart.length === 0}
                          onSubmitAdoption={handleAdoptionSubmit}
                        />
                      </Col>
                    </Row>
                  )}
                </Container>
              </ProtectedRoute>
            }
          />

          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <ContactForm />
              </ProtectedRoute>
            }
          />

          {/* 7. Trang Đăng nhập & Đăng ký thành viên */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 8. Trang Quản trị CRUD dành riêng cho Admin (Bảo vệ bởi ProtectedRoute) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 9. Tuyến đường mặc định: Chuyển hướng về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* FOOTER CHÂN TRANG */}
      <footer className="py-4 text-center border-top text-muted small mt-auto">
        <Container>
          <p className="mb-1"><strong>Pet Haven</strong> - Hệ Thống Quản Lý & Nhận Nuôi Thú Cưng</p>
        </Container>
      </footer>
    </div>
  );
}

// Bọc toàn bộ ứng dụng bằng BrowserRouter, ThemeProvider và AuthProvider
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
