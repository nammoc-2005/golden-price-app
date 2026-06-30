import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const fetchLatestPrices = async () => {
  const res = await axios.get(`${API_BASE}/gold-prices/latest`);
  return res.data;
};

export const fetchGoldTypes = async () => {
  const res = await axios.get(`${API_BASE}/gold-types`);
  return res.data;
};

export const fetchHistory = async (goldTypeId, days = 7) => {
  const res = await axios.get(
    `${API_BASE}/gold-prices/history/${goldTypeId}?days=${days}`
  );
  return res.data;
};

export const updatePrice = async (goldTypeId, gia_mua, gia_ban) => {
  const res = await axios.put(`${API_BASE}/gold-prices/${goldTypeId}`, {
    gia_mua,
    gia_ban,
  });
  return res.data;
};
