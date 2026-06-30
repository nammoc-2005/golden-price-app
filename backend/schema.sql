-- =========================================================
-- CSDL Bảng giá vàng - DOANH NGHIỆP VÀNG BẠC TƯ NHÂN VĂN TRƯỜNG VTJ
-- =========================================================

CREATE DATABASE IF NOT EXISTS gold_price_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE gold_price_db;

-- Danh mục các loại vàng (giữ thứ tự hiển thị)
CREATE TABLE IF NOT EXISTS gold_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ten_loai VARCHAR(100) NOT NULL,
  thu_tu INT NOT NULL DEFAULT 0,
  nhom TINYINT NOT NULL DEFAULT 1 COMMENT '1 = cột trái, 2 = cột phải'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Giá vàng theo từng ngày cho từng loại
CREATE TABLE IF NOT EXISTS gold_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gold_type_id INT NOT NULL,
  gia_mua BIGINT NOT NULL DEFAULT 0,
  gia_ban BIGINT NOT NULL DEFAULT 0,
  ngay DATE NOT NULL,
  gio_cap_nhat TIME NOT NULL,
  FOREIGN KEY (gold_type_id) REFERENCES gold_types(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_type_day (gold_type_id, ngay)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Danh mục loại vàng (theo đúng bảng mẫu)
-- ---------------------------------------------------------
INSERT INTO gold_types (ten_loai, thu_tu, nhom) VALUES
  ('nhẫn tròn vỉ 9999',      1, 1),
  ('nhẫn tròn 24k9999',      2, 1),
  ('vàng trang sức 24k995',  3, 1),
  ('nhẫn tròn 24k 999',      4, 1),
  ('VÀNG PNJ 650',           1, 2),
  ('VÀNG HJC TD 610',        2, 2),
  ('VÀNG CÔNG NGHỆ',         3, 2),
  ('TRANG SỨC 24K 999',      4, 2);

-- ---------------------------------------------------------
-- Dữ liệu mẫu cho 7 ngày gần nhất (để biểu đồ có dữ liệu ngay)
-- Lưu ý: chạy script này CHỈ để demo, có thể xoá khi dùng thật.
-- ---------------------------------------------------------
INSERT INTO gold_prices (gold_type_id, gia_mua, gia_ban, ngay, gio_cap_nhat) VALUES
(1, 13150000, 13550000, CURDATE() - INTERVAL 6 DAY, '09:00:00'),
(1, 13200000, 13600000, CURDATE() - INTERVAL 5 DAY, '09:00:00'),
(1, 13250000, 13650000, CURDATE() - INTERVAL 4 DAY, '09:00:00'),
(1, 13300000, 13700000, CURDATE() - INTERVAL 3 DAY, '09:00:00'),
(1, 13350000, 13750000, CURDATE() - INTERVAL 2 DAY, '09:00:00'),
(1, 13380000, 13780000, CURDATE() - INTERVAL 1 DAY, '09:00:00'),
(1, 13400000, 13800000, CURDATE(),                   '10:04:24'),

(2, 12900000, 13350000, CURDATE() - INTERVAL 1 DAY, '09:00:00'),
(2, 13100000, 13550000, CURDATE(),                   '10:04:24'),

(3, 12750000, 13200000, CURDATE() - INTERVAL 1 DAY, '09:00:00'),
(3, 12950000, 13400000, CURDATE(),                   '10:04:24'),

(4, 0, 0, CURDATE(), '10:04:24'),

(5, 7300000, 8700000, CURDATE() - INTERVAL 1 DAY, '09:00:00'),
(5, 7500000, 8900000, CURDATE(),                   '10:04:24'),

(6, 7200000, 8600000, CURDATE() - INTERVAL 1 DAY, '09:00:00'),
(6, 7400000, 8800000, CURDATE(),                   '10:04:24'),

(7, 6100000, 7300000, CURDATE() - INTERVAL 1 DAY, '09:00:00'),
(7, 6300000, 7500000, CURDATE(),                   '10:04:24'),

(8, 0, 0, CURDATE(), '10:04:24');
