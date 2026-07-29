import React, { useState } from 'react';
import GoldPriceTable from './components/GoldPriceTable';
import GoldPriceChart from './components/GoldPriceChart';

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="page">
      <div className="company-header">
        <div className="so">SỞ KẾ HOẠCH VÀ ĐẦU TƯ QUẢNG NINH</div>
        <div className="ten-cong-ty">
          DOANH NGHIỆP VÀNG BẠC TƯ NHÂN VĂN TRƯỜNG QUẢNG NINH
        </div>
        <div className="mst">MST: 5702158438</div>
        <div className="dia-chi">📍 238 Thống Nhất, Tiên Yên, Quảng Ninh &nbsp;|&nbsp; 📞 0911 034 444</div>
      </div>

      <div className="title-row">
        <h1>BẢNG TỶ GIÁ VÀNG</h1>
      </div>

      <div className="main-layout">
        <GoldPriceTable onUpdated={() => setRefreshKey((k) => k + 1)} />
        <GoldPriceChart refreshKey={refreshKey} />
      </div>
    </div>
  );
}