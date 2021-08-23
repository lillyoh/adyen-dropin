const express = require('express');
const app = express();
const { Client, Config, CheckoutAPI } = require('@adyen/api-library');


const config = new Config();
config.apiKey = process.env.API_KEY;
config.merchantAccount = process.env.MERCHANT_ACCOUNT
const client = new Client({ config });
client.setEnvironment('TEST');
const checkout = new CheckoutAPI(client);


// Render HTML file into the server
app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})


// Get available payment methods
app.post('/', async (req, res) => {
  try {
    const response = await checkout.paymentMethods({
      merchantAccount: config.merchantAccount,
      amount: {
        currency: 'USD',
        value: 100
      },
      channel: 'Web',
      countryCode: 'US',
      shopperLocale: 'en-US'
    })
    res.json(response);
  } catch (error) {
    console.error(`Error: ${error}`)

  }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
