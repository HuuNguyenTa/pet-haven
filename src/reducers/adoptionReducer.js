// src/reducers/adoptionReducer.js
/**
 * =========================================================================
 * REDUCER QUẢN LÝ DANH SÁCH NHẬN NUÔI & GÓI CHĂM SÓC (useReducer)
 * =========================================================================
 * Kiến thức áp dụng:
 * 1. State Immutability (Tính bất biến của State): Không bao giờ mutate state trực tiếp.
 * 2. Phân tách rõ ràng giữa Actions (Hành động) và Reducer Logic.
 * 3. Thao tác mảng an toàn với .map(), .filter() và Spread Operator [...state].
 * =========================================================================
 */

// Trạng thái khởi tạo mặc định (Initial State):
// Có sẵn 1-2 bé mẫu để người dùng vào trang giỏ hàng thấy ngay dữ liệu demo
export const initialAdoptionState = [
  {
    id: '1',
    name: 'Bim Bim',
    breed: 'Golden Retriever',
    price: 120, // Phí nhận nuôi hoặc gói chăm sóc cơ bản (USD)
    months: 1,  // Số tháng đăng ký gói bảo hiểm / chăm sóc dinh dưỡng
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    name: 'Miu Miu',
    breed: 'British Shorthair',
    price: 95,
    months: 2,
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80'
  }
];

/**
 * Hàm Reducer chính điều khiển các thay đổi trạng thái
 * @param {Array} state Danh sách thú cưng trong đơn nhận nuôi hiện tại
 * @param {Object} action Gồm { type: string, payload: any }
 */
export function adoptionReducer(state, action) {
  switch (action.type) {

    // 1. THÊM THÚ CƯNG VÀO DANH SÁCH NHẬN NUÔI
    case 'ADD_PET': {
      const pet = action.payload; // Bé thú cưng được truyền vào

      // Kiểm tra xem bé đã có trong đơn chưa
      const existingItem = state.find((item) => String(item.id) === String(pet.id));

      if (existingItem) {
        // Đã có: Tăng số tháng chăm sóc lên 1 bằng .map()
        return state.map((item) =>
          String(item.id) === String(pet.id)
            ? { ...item, months: item.months + 1 }
            : item
        );
      } else {
        // Chưa có: Dùng Spread Operator [...] thêm phần tử mới vào mảng
        return [
          ...state,
          {
            id: String(pet.id),
            name: pet.name,
            breed: pet.breed,
            price: Number(pet.price) || 50,
            months: 1,
            image: pet.image
          }
        ];
      }
    }

    // 2. CẬP NHẬT SỐ THÁNG / SỐ LƯỢNG GÓI CHĂM SÓC
    case 'UPDATE_QUANTITY': {
      const { id, months } = action.payload;

      // Nếu số lượng giảm về 0 -> Tự động xóa khỏi danh sách
      if (months <= 0) {
        return state.filter((item) => String(item.id) !== String(id));
      }

      // Ngược lại, cập nhật số tháng mới cho bé đó
      return state.map((item) =>
        String(item.id) === String(id) ? { ...item, months: Number(months) } : item
      );
    }

    // 3. XÓA BÉ KHỎI DANH SÁCH NHẬN NUÔI
    case 'REMOVE_ITEM': {
      // Dùng .filter() trả về mảng mới loại bỏ phần tử có id cần xóa
      return state.filter((item) => String(item.id) !== String(action.payload.id));
    }

    // 4. LÀM RỖNG DANH SÁCH KHI GỬI ĐƠN THÀNH CÔNG
    case 'CLEAR_CART': {
      return [];
    }

    // Mặc định trả về state hiện tại nếu action không khớp
    default:
      return state;
  }
}
