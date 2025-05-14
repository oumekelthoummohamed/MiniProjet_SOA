const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

// Exemple de prix par API
const pricingTable = {
  'weather-api': 0.01,
  'stock-api': 0.02,
  'currency-api': 0.015
};

app.get('/pricing/:apiName', (req, res) => {
  const price = pricingTable[req.params.apiName];
  if (price !== undefined) {
    res.json({ api: req.params.apiName, price });
  } else {
    res.status(404).json({ message: 'API not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Pricing Service listening on port ${PORT}`);
});
