const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const { Client, Config, CheckoutAPI } = require('@adyen/api-library');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Render HTML file into the server
app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

const config = new Config();
config.apiKey = process.env.API_KEY;
config.merchantAccount = process.env.MERCHANT_ACCOUNT
const client = new Client({ config });
client.setEnvironment('TEST');
const checkout = new CheckoutAPI(client);

// Get available payment methods
app.post('/api/getPaymentMethods', async (req, res) => {
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
    });
    res.json(response);
  } catch (error) {
    console.error(`Error: ${error}`)
  }
})


// Initiate a payment
const paymentDataStore = {};
app.post('/api/initiatePayment', async (req, res) => {
  try {
    const orderRef = uuidv4();
    const response = await checkout.payments({
      amount: { currency: 'USD', value: 1000 },
      reference: orderRef,
      merchantAccount: process.env.MERCHANT_ACCOUNT,
      channel: 'Web',
      returnUrl: `http://localhost:5000/api/handleShopperRedirect?orderRef=${orderRef}`,
      browserInfo: req.body.browserInfo,
      paymentMethod: req.body.paymentMethod
    });

    const { action } = response;

    if (action) {
      paymentDataStore[orderRef] = action.paymentData;
    }
    res.json(response);
  } catch (error) {
    console.error(`Error: ${error}`)
  }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
