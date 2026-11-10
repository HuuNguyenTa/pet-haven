// src/services/petService.js
/**
 * =========================================================================
 * TẦNG DỊCH VỤ (SERVICE LAYER) - KẾT NỐI FETCH API TỚI MOCKAPI
 * =========================================================================
 * Mục đích:
 * 1. Tách biệt hoàn toàn logic gọi mạng (Networking) ra khỏi Giao diện (UI).
 * 2. Thực hiện đầy đủ các phương thức HTTP chuẩn RESTful:
 *    - GET: Lấy danh sách thú cưng hoặc chi tiết theo ID
 *    - POST: Thêm mới thú cưng vào hệ thống
 *    - PUT: Chỉnh sửa thông tin thú cưng theo ID
 *    - DELETE: Xóa thú cưng khỏi cơ sở dữ liệu
 * =========================================================================
 */

// ĐƯỜNG DẪN MOCKAPI
const API_URL = 'https://6af158d111a6aa866e8025cd.mockapi.io/pets'

/**
 * 1. LẤY TOÀN BỘ DANH SÁCH THÚ CƯNG (HTTP GET)
 * @returns {Promise<Array>} Mảng danh sách thú cưng
 */
export const getAllPets = async () => {
  // Lệnh fetch mặc định sử dụng method: 'GET'
  const response = await fetch(API_URL);

  // Kiểm tra response.ok (Status code 200 - 299). Nếu 404 hay 500 thì ném lỗi
  if (!response.ok) {
    throw new Error(`Lỗi tải dữ liệu thú cưng (HTTP Status: ${response.status})`);
  }

  // Chuyển đổi dữ liệu ReadableStream thành JSON
  return await response.json();
};

/**
 * 2. LẤY CHI TIẾT 1 BÉ THÚ CƯNG THEO ID (HTTP GET theo :id)
 * Phục vụ cho trang PetDetail và hook useParams()
 * @param {string|number} id ID của thú cưng
 */
export const getPetById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Không tìm thấy thú cưng có ID: ${id}`);
  }
  return await response.json();
};

/**
 * 3. TẠO MỚI THÚ CƯNG (HTTP POST)
 * Yêu cầu quyền Admin từ AuthContext
 * @param {Object} petData Thông tin thú cưng nhập từ Formik
 */
export const createPet = async (petData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' // Báo cho server định dạng dữ liệu gửi lên là JSON
    },
    body: JSON.stringify(petData) // Chuỗi hóa Object thành chuỗi JSON
  });

  if (!response.ok) {
    throw new Error('Thất bại khi thêm mới thú cưng lên MockAPI');
  }

  return await response.json();
};

/**
 * 4. CẬP NHẬT THÔNG TIN THÚ CƯNG (HTTP PUT)
 * Ghi đè toàn bộ dữ liệu mới vào phần tử trùng ID
 * @param {string|number} id ID của bé cần sửa
 * @param {Object} petData Dữ liệu mới đã chỉnh sửa
 */
export const updatePet = async (id, petData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(petData)
  });

  if (!response.ok) {
    throw new Error(`Thất bại khi cập nhật thú cưng ID: ${id}`);
  }

  return await response.json();
};

/**
 * 5. XÓA THÚ CƯNG KHỎI CƠ SỞ DỮ LIỆU (HTTP DELETE)
 * @param {string|number} id ID của bé cần xóa
 */
export const deletePet = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`Thất bại khi xóa thú cưng ID: ${id}`);
  }

  return await response.json();
};
