// seedMockApi.js
// Script tự động nạp 16 bé thú cưng mẫu vào MockAPI
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Đọc API_URL từ petService.js
const serviceFilePath = path.join(__dirname, 'src', 'services', 'petService.js');
const serviceContent = fs.readFileSync(serviceFilePath, 'utf8');
const match = serviceContent.match(/const\s+API_URL\s*=\s*['"]([^'"]+)['"]/);

const API_URL = match ? match[1] : 'https://6aeca917fc3b911e6fd57c5c.mockapi.io/pets';

// 2. Đọc danh sách thú cưng mẫu
const dataFilePath = path.join(__dirname, 'src', 'data', 'petsData.json');
const pets = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

async function seed() {
  console.log(`\n🚀 Bắt đầu nạp dữ liệu vào MockAPI endpoint: ${API_URL}`);
  console.log(`📋 Tổng số bé thú cưng cần tạo: ${pets.length}\n`);

  try {
    const testRes = await fetch(API_URL);
    if (testRes.status === 404) {
      console.error(`❌ LỖI 404: Resource "pets" chưa được tạo trên MockAPI!`);
      console.error(`👉 Hãy lên mockapi.io tạo Resource tên là "pets" trước khi chạy script này.\n`);
      return;
    }
  } catch (err) {
    console.error(`❌ Không thể kết nối tới MockAPI: ${err.message}`);
    return;
  }

  let successCount = 0;

  for (let i = 0; i < pets.length; i++) {
    const pet = pets[i];
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pet)
      });

      if (!res.ok) {
        console.error(`❌ [${i + 1}/${pets.length}] Thất bại: ${pet.name} (HTTP ${res.status})`);
      } else {
        const created = await res.json();
        console.log(`✅ [${i + 1}/${pets.length}] Đã thêm: ${created.name} - ${created.breed} (ID: ${created.id})`);
        successCount++;
      }
    } catch (e) {
      console.error(`❌ [${i + 1}/${pets.length}] Lỗi khi thêm ${pet.name}: ${e.message}`);
    }
  }

  console.log(`\n🎉 HOÀN TẤT: Đã tạo thành công ${successCount}/${pets.length} bé thú cưng trên MockAPI!`);
}

seed();
