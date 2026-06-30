# Bảng tỷ giá vàng - VTJ

Hệ thống hiển thị bảng giá vàng (mua vào / bán ra) theo từng loại, cho phép
sửa giá trực tiếp trên bảng (không cần đăng nhập), và biểu đồ biến động giá
7 ngày của 1 loại vàng (mặc định: nhẫn tròn vỉ 9999).

## Cấu trúc project

```
golden-price-app/
  backend/      -> API Node.js + Express + MySQL
  frontend/     -> Giao diện React (Vite)
```

## 1. Cài đặt Database (MySQL)

1. Mở MySQL (XAMPP / phpMyAdmin / mysql CLI đều được).
2. Chạy file `backend/schema.sql` để tạo database `gold_price_db`,
   tạo bảng và thêm dữ liệu mẫu 7 ngày.

   Ví dụ với mysql CLI:
   ```
   mysql -u root -p < backend/schema.sql
   ```

## 2. Cài đặt & chạy Backend

```bash
cd backend
npm install
cp .env.example .env
# Mở .env, điền đúng thông tin MySQL của bạn (user/password)
npm run dev
```

Backend sẽ chạy tại `http://localhost:5000`.

Kiểm tra nhanh:
- `GET http://localhost:5000/api/gold-prices/latest` -> trả về giá mới nhất
- `GET http://localhost:5000/api/gold-types` -> danh sách loại vàng

## 3. Cài đặt & chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Mở `http://localhost:5173` để xem trang.

## 4. Cách dùng

- **Sửa giá**: gõ trực tiếp vào ô số trong bảng (mua vào / bán ra của từng
  loại vàng), sau đó bấm nút **"Lưu giá vàng"** ở dưới bảng. Hệ thống sẽ
  ghi giá mới cho **ngày hôm nay**, không ảnh hưởng dữ liệu các ngày trước
  (giữ nguyên lịch sử cho biểu đồ).
- **Biểu đồ**: chọn loại vàng ở dropdown góc trên bên phải biểu đồ để xem
  biến động giá mua/bán trong 7 ngày gần nhất. Mặc định hiển thị
  "nhẫn tròn vỉ 9999".

## 5. Mở rộng sau này (gợi ý)

- Thêm xác thực (đăng nhập) nếu sau này muốn giới hạn quyền sửa giá.
- Thêm cron job tự động lưu giá theo giờ thay vì sửa tay.
- Cho phép thêm/xoá loại vàng từ giao diện (hiện tại danh mục loại vàng
  cố định trong bảng `gold_types`, sửa trực tiếp trong DB nếu cần thêm).
