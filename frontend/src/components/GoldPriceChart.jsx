import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchGoldTypes, fetchHistory } from '../api';

const formatTrieu = (value) => {
  if (!value) return '0';
  return (value / 1000).toLocaleString('vi-VN'); // hiển thị theo nghìn đồng cho gọn
};

const formatNgay = (isoDate) => {
  const d = new Date(isoDate);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export default function GoldPriceChart({ refreshKey }) {
  const [goldTypes, setGoldTypes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);

  // Tải danh sách loại vàng, mặc định chọn "nhẫn tròn vỉ 9999"
  useEffect(() => {
    (async () => {
      try {
        const types = await fetchGoldTypes();
        setGoldTypes(types);
        const defaultType = types.find((t) =>
          t.ten_loai.toLowerCase().includes('nhẫn tròn vỉ 9999')
        );
        setSelectedId((defaultType || types[0])?.id ?? null);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    (async () => {
      try {
        const data = await fetchHistory(selectedId, 7);
        setHistory(
          data.map((d) => ({
            ngay: formatNgay(d.ngay),
            'Mua vào': Number(d.gia_mua),
            'Bán ra': Number(d.gia_ban),
          }))
        );
      } catch (err) {
        console.error(err);
      }
    })();
  }, [selectedId, refreshKey]);

  const selectedName = goldTypes.find((t) => t.id === selectedId)?.ten_loai || '';

  return (
    <div className="chart-wrapper">
      <div className="chart-header">
        <h2>Biến động giá 7 ngày</h2>
        <select
          className="gold-select"
          value={selectedId ?? ''}
          onChange={(e) => setSelectedId(Number(e.target.value))}
        >
          {goldTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.ten_loai}
            </option>
          ))}
        </select>
      </div>

      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
        {selectedName} · Đơn vị: nghìn đồng/chỉ
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={history}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
          <XAxis dataKey="ngay" stroke="#94a3b8" fontSize={12} />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={formatTrieu}
            width={50}
          />
          <Tooltip
            contentStyle={{ background: '#0b1221', border: '1px solid #233152' }}
            labelStyle={{ color: '#fff' }}
            formatter={(value) => value.toLocaleString('vi-VN')}
          />
          <Line type="monotone" dataKey="Mua vào" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="Bán ra" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>

      <div className="legend-line">
        <span><span className="legend-dot" style={{ background: '#22c55e' }} />Mua vào</span>
        <span><span className="legend-dot" style={{ background: '#fbbf24' }} />Bán ra</span>
      </div>
    </div>
  );
}
