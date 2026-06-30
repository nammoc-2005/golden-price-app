const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/gold-types
// Lấy danh sách loại vàng (dùng cho dropdown chọn biểu đồ)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, ten_loai, thu_tu, nhom FROM gold_types ORDER BY nhom ASC, thu_tu ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Không lấy được danh mục loại vàng' });
  }
});

module.exports = router;
