const express = require('express');
const router = express.Router();
const pool = require('../db');

// ---------------------------------------------------------
// GET /api/gold-prices/latest
// Lấy giá mới nhất (ngày gần nhất có dữ liệu) của tất cả loại vàng,
// kèm thông tin nhóm (cột trái / cột phải) để frontend dựng bảng.
// ---------------------------------------------------------
router.get('/latest', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT gt.id AS gold_type_id, gt.ten_loai, gt.thu_tu, gt.nhom,
             gp.gia_mua, gp.gia_ban, gp.ngay, gp.gio_cap_nhat
      FROM gold_types gt
      LEFT JOIN gold_prices gp ON gp.gold_type_id = gt.id
      WHERE gp.ngay = (
        SELECT MAX(ngay) FROM gold_prices WHERE gold_type_id = gt.id
      ) OR gp.id IS NULL
      ORDER BY gt.nhom ASC, gt.thu_tu ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Không lấy được giá vàng mới nhất' });
  }
});

// ---------------------------------------------------------
// GET /api/gold-prices/history/:goldTypeId?days=7
// Lấy lịch sử giá của 1 loại vàng trong N ngày gần nhất (mặc định 7)
// ---------------------------------------------------------
router.get('/history/:goldTypeId', async (req, res) => {
  const { goldTypeId } = req.params;
  const days = parseInt(req.query.days, 10) || 7;
  try {
    const [rows] = await pool.query(
      `SELECT ngay, gia_mua, gia_ban
       FROM gold_prices
       WHERE gold_type_id = ?
       ORDER BY ngay DESC
       LIMIT ?`,
      [goldTypeId, days]
    );
    // Trả về theo thứ tự thời gian tăng dần để vẽ biểu đồ
    res.json(rows.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Không lấy được lịch sử giá' });
  }
});

// ---------------------------------------------------------
// PUT /api/gold-prices/:goldTypeId
// Cập nhật (hoặc tạo mới) giá của 1 loại vàng cho ngày hôm nay.
// Body: { gia_mua, gia_ban }
// Không yêu cầu đăng nhập theo yêu cầu của khách hàng.
// ---------------------------------------------------------
router.put('/:goldTypeId', async (req, res) => {
  const { goldTypeId } = req.params;
  const { gia_mua, gia_ban } = req.body;

  if (gia_mua === undefined || gia_ban === undefined) {
    return res.status(400).json({ error: 'Thiếu gia_mua hoặc gia_ban' });
  }

  try {
    const now = new Date();
    const gio = now.toTimeString().slice(0, 8); // HH:MM:SS

    await pool.query(
      `INSERT INTO gold_prices (gold_type_id, gia_mua, gia_ban, ngay, gio_cap_nhat)
       VALUES (?, ?, ?, CURDATE(), ?)
       ON DUPLICATE KEY UPDATE
         gia_mua = VALUES(gia_mua),
         gia_ban = VALUES(gia_ban),
         gio_cap_nhat = VALUES(gio_cap_nhat)`,
      [goldTypeId, gia_mua, gia_ban, gio]
    );

    res.json({ success: true, message: 'Đã cập nhật giá vàng' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Không cập nhật được giá vàng' });
  }
});

module.exports = router;
