// src/components/AdoptionCart.jsx
import React from 'react';
import { Table, Button, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * =========================================================================
 * DANH SÁCH BÉ ĐĂNG KÝ NHẬN NUÔI & GÓI CHĂM SÓC (useReducer)
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. Nhận cart và dispatch từ hook useReducer ở App.jsx.
 * 2. Derived State: Dùng Array.reduce() tính toán tổng chi phí và tổng gói.
 * 3. Kích hoạt Action: UPDATE_QUANTITY, REMOVE_ITEM tới Reducer.
 * =========================================================================
 */
function AdoptionCart({ cart, dispatch }) {
  // Tính toán Derived State bằng hàm reduce()
  const totalMonths = cart.reduce((sum, item) => sum + item.months, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.months, 0);

  return (
    <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
      <Card.Header className="bg-warning text-dark py-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">Danh Sách Đăng Ký Nhận Nuôi</h5>
        <Badge bg="dark" className="fs-6">
          {cart.length} bé
        </Badge>
      </Card.Header>

      <Card.Body className="p-0">
        {cart.length === 0 ? (
          <div className="text-center py-5 text-muted p-4">
            <h5 className="fw-bold">Bạn chưa chọn bé thú cưng nào!</h5>
            <p className="mb-3">Hãy dạo quanh một vòng và chọn một bé về làm bạn nhé.</p>
            <Button as={Link} to="/pets" variant="warning" className="rounded-pill fw-bold">
              Khám Phá Thú Cưng Ngay
            </Button>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '80px' }}>Hình</th>
                  <th>Tên & Giống</th>
                  <th>Phí/Tháng</th>
                  <th className="text-center" style={{ width: '150px' }}>Gói chăm sóc</th>
                  <th className="text-end">Tạm tính</th>
                  <th className="text-center">Xóa</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="rounded-3 shadow-sm"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>
                      <div className="fw-bold text-primary">{item.name}</div>
                      <small className="text-muted">{item.breed}</small>
                    </td>
                    <td className="fw-semibold text-success">${item.price}</td>
                    <td>
                      {/* Bộ nút tăng / giảm số tháng chăm sóc (useReducer) */}
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="px-2 py-0 fw-bold rounded-circle"
                          onClick={() =>
                            dispatch({
                              type: 'UPDATE_QUANTITY',
                              payload: { id: item.id, months: item.months - 1 }
                            })
                          }
                        >
                          -
                        </Button>
                        <span className="fw-bold px-2">{item.months} tháng</span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="px-2 py-0 fw-bold rounded-circle"
                          onClick={() =>
                            dispatch({
                              type: 'UPDATE_QUANTITY',
                              payload: { id: item.id, months: item.months + 1 }
                            })
                          }
                        >
                          +
                        </Button>
                      </div>
                    </td>
                    <td className="text-end fw-bold text-dark">
                      ${(item.price * item.months).toFixed(2)}
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-pill px-2"
                        onClick={() =>
                          dispatch({
                            type: 'REMOVE_ITEM',
                            payload: { id: item.id }
                          })
                        }
                      >
                        ✕
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* TỔNG KẾT CHI PHÍ (CART SUMMARY) */}
        {cart.length > 0 && (
          <div className="p-3 bg-light border-top d-flex justify-content-between align-items-center">
            <div>
              <span className="text-muted">Tổng số tháng bảo trợ: </span>
              <strong className="text-dark">{totalMonths} tháng</strong>
            </div>
            <div>
              <span className="text-muted me-2">Tổng chi phí nhận nuôi:</span>
              {/* làm tròn 2 chữ số thập phân chuẩn định dạng tiền tệ quốc tế */}
              <span className="fs-4 fw-bold text-success">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default AdoptionCart;
