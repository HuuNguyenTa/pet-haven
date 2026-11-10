// src/components/AdoptionSuccess.jsx
import React, { useMemo } from 'react';
import { Card, Table, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * =========================================================================
 * XÁC NHẬN HỒ SƠ ĐĂNG KÝ NHẬN NUÔI THÀNH CÔNG
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. Props: Nhận order (thông tin người nhận nuôi + danh sách bé + tổng tiền).
 * 2. Cung cấp nút hoàn tất onReset để reset state đơn hàng.
 * =========================================================================
 */
function AdoptionSuccess({ order, onReset }) {
  const { customerInfo, items, totalMonths, totalPrice } = order;
  const orderCode = useMemo(() => Date.now().toString().slice(-6), []);

  return (
    <Card className="shadow-lg border-0 rounded-4 overflow-hidden my-4">
      <Card.Header className="bg-success text-white py-4 text-center">
        <h3 className="fw-bold mb-1">Chúc Mừng Bạn Đã Gửi Hồ Sơ Thành Công!</h3>
        <p className="mb-0 opacity-75">
          Mã hồ sơ: <span className="font-monospace fw-bold">#PET-{orderCode}</span>
        </p>
      </Card.Header>

      <Card.Body className="p-4 p-md-5">
        <Alert variant="success" className="text-center rounded-3 mb-4">
          Cảm ơn bạn <strong>{customerInfo.fullName}</strong>! Pet Haven đã ghi nhận đơn đăng ký nhận nuôi. Chúng mình sẽ liên hệ qua số điện thoại <strong>{customerInfo.phone}</strong> trong vòng 24 giờ tới để hướng dẫn đón bé về nhà!
        </Alert>

        {/* THÔNG TIN NGƯỜI NHẬN NUÔI */}
        <h5 className="fw-bold text-primary mb-3">Thông Tin Chủ Nuôi:</h5>
        <div className="bg-light p-3 rounded-3 mb-4">
          <div className="row g-2">
            <div className="col-md-6">
              <strong>Họ và tên:</strong> {customerInfo.fullName}
            </div>
            <div className="col-md-6">
              <strong>Email:</strong> {customerInfo.email}
            </div>
            <div className="col-md-6">
              <strong>Số điện thoại:</strong> {customerInfo.phone}
            </div>
            <div className="col-md-6">
              <strong>Không gian sống:</strong> {customerInfo.housingType}
            </div>
            <div className="col-12">
              <strong>Địa chỉ đón bé:</strong> {customerInfo.address}
            </div>
          </div>
        </div>

        {/* DANH SÁCH BÉ ĐÃ ĐĂNG KÝ */}
        <h5 className="fw-bold text-primary mb-3">Danh Sách Thú Cưng Đón Về:</h5>
        <Table responsive bordered hover className="align-middle mb-4">
          <thead className="table-light">
            <tr>
              <th>Hình ảnh</th>
              <th>Tên bé & Giống</th>
              <th>Phí/Tháng</th>
              <th>Số tháng bảo trợ</th>
              <th className="text-end">Tạm tính</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="rounded-3"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td>
                  <strong>{item.name}</strong> ({item.breed})
                </td>
                <td className="text-success font-monospace">${item.price}</td>
                <td>{item.months} tháng</td>
                <td className="text-end fw-bold">${(item.price * item.months).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="table-warning fw-bold fs-5">
              <td colSpan="3" className="text-end">Tổng Cộng ({totalMonths} tháng bảo trợ):</td>
              <td colSpan="2" className="text-end text-success">${totalPrice.toFixed(2)}</td>
            </tr>
          </tfoot>
        </Table>

        <div className="d-flex justify-content-center gap-3">
          <Button variant="outline-success" onClick={onReset} className="rounded-pill px-4">
            Đăng Ký Đơn Khác
          </Button>
          <Button as={Link} to="/" variant="warning" onClick={onReset} className="rounded-pill px-4 fw-bold">
            Quay Về Trang Chủ
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default AdoptionSuccess;
