const express = require('express');
const cors = require('cors');
require('dotenv').config();

const goldPricesRoutes = require('./routes/goldPrices');
const goldTypesRoutes = require('./routes/goldTypes');

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.use('/api/gold-prices', goldPricesRoutes);
app.use('/api/gold-types', goldTypesRoutes);

app.get('/', (req, res) => {
  res.send('API Bảng giá vàng VTJ đang hoạt động');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
