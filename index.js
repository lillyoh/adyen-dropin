const express = require('express');
const app = express();
const { Client, Config, CheckoutAPI } = require('@adyen/api-library');

app.get('/', (req, res) => {
  res.send('Testing')
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
