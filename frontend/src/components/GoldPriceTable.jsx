import React, { useEffect, useState } from 'react';
import { fetchLatestPrices, updatePrice } from '../api';

const formatNumber = (value) => {
  if (value === null || value === undefined) return '';
  const n = Number(value);
  if (n === 0) return '000';
  return n.toLocaleString('vi-VN');
};

const parseNumber = (str) => {
  const cleaned = String(str).replace(/[^\d]/g, '');
  return cleaned === '' ? 0 : parseInt(cleaned, 10);
};

export default function GoldPriceTable({ onUpdated }) {
  const [rows, setRows] = useState([]); // dữ liệu thô từ API
  const [edits, setEdits] = useState({}); // { goldTypeId: { gia_mua, gia_ban } }
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  // Đồng hồ thời gian thực, cập nhật mỗi giây
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchLatestPrices();
      setRows(data);
    } catch (err) {
      console.error(err);
      setStatus('Không tải được dữ liệu. Kiểm tra backend đã chạy chưa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const nhom1 = rows.filter((r) => r.nhom === 1).sort((a, b) => a.thu_tu - b.thu_tu);
  const nhom2 = rows.filter((r) => r.nhom === 2).sort((a, b) => a.thu_tu - b.thu_tu);
  const soDong = Math.max(nhom1.length, nhom2.length);

  const getValue = (item, field) => {
    if (!item) return 0;
    const edited = edits[item.gold_type_id];
    if (edited && edited[field] !== undefined) return edited[field];
    return item[field] ?? 0;
  };

  const handleChange = (goldTypeId, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [goldTypeId]: {
        gia_mua: prev[goldTypeId]?.gia_mua ?? getValue({ gold_type_id: goldTypeId }, 'gia_mua'),
        gia_ban: prev[goldTypeId]?.gia_ban ?? getValue({ gold_type_id: goldTypeId }, 'gia_ban'),
        [field]: parseNumber(value),
      },
    }));
  };

  const handleSaveAll = async () => {
    const ids = Object.keys(edits);
    if (ids.length === 0) {
      setStatus('Không có thay đổi nào để lưu.');
      return;
    }
    setStatus('Đang lưu...');
    try {
      for (const id of ids) {
        const row = rows.find((r) => String(r.gold_type_id) === String(id));
        const gia_mua = edits[id].gia_mua ?? row?.gia_mua ?? 0;
        const gia_ban = edits[id].gia_ban ?? row?.gia_ban ?? 0;
        await updatePrice(id, gia_mua, gia_ban);
      }
      setStatus('Đã lưu giá vàng mới ✓');
      setEdits({});
      await loadData();
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
      setStatus('Có lỗi khi lưu, vui lòng thử lại.');
    }
  };

  const cacThu = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const vnTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const ngayHienThi = `${cacThu[vnTime.getDay()]}, ${vnTime.toLocaleDateString('vi-VN')}`;
  const gioHienThi = vnTime.toLocaleTimeString('vi-VN', { hour12: false });

  if (loading) {
    return <div className="board-wrapper" style={{ padding: 24 }}>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="board-wrapper">
      <div className="date-time-row">
        <span className="ngay-label"> {ngayHienThi}</span>
        <span className="gio-label"> {gioHienThi}</span>
      </div>

      <table className="price-table">
        <thead>
          <tr>
            <th>MUA VÀO</th>
            <th>BÁN RA</th>
            <th colSpan={2}>LOẠI VÀNG</th>
            <th>MUA VÀO</th>
            <th>BÁN RA</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: soDong }).map((_, i) => {
            const left = nhom1[i];
            const right = nhom2[i];
            return (
              <tr key={i}>
                <td>
                  {left && (
                    <input
                      className="gia-input"
                      value={formatNumber(getValue(left, 'gia_mua'))}
                      onChange={(e) => handleChange(left.gold_type_id, 'gia_mua', e.target.value)}
                    />
                  )}
                </td>
                <td>
                  {left && (
                    <input
                      className="gia-input"
                      value={formatNumber(getValue(left, 'gia_ban'))}
                      onChange={(e) => handleChange(left.gold_type_id, 'gia_ban', e.target.value)}
                    />
                  )}
                </td>
                <td className="loai-vang-cell">{left?.ten_loai || ''}</td>
                <td className="loai-vang-cell">{right?.ten_loai || ''}</td>
                <td>
                  {right && (
                    <input
                      className="gia-input"
                      value={formatNumber(getValue(right, 'gia_mua'))}
                      onChange={(e) => handleChange(right.gold_type_id, 'gia_mua', e.target.value)}
                    />
                  )}
                </td>
                <td>
                  {right && (
                    <input
                      className="gia-input"
                      value={formatNumber(getValue(right, 'gia_ban'))}
                      onChange={(e) => handleChange(right.gold_type_id, 'gia_ban', e.target.value)}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="save-status">{status}</div>
      <div className="save-row">
        <button className="save-btn" onClick={handleSaveAll}>
          Lưu giá vàng
        </button>
      </div>
    </div>
  );
}
