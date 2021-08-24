
// Call server
async function callServer(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error(`Error: ${error}`)
  }
}

// Handle server response
async function handleServerResponse(response, component) {
  if (response.action) {
    dropin.handleAction(res.action);
  } else {
    switch (response.resultCode) {
      case "Authorised":
        console.log('success')
        break;
      default:
        console.log('default')
        break;
    }
  }
}

// Handle 'pay' button submission
async function handleSubmit(state, dropin, url) {
  try {
    const response = await callServer(url, state.data);
    return handleServerResponse(response, dropin);
  } catch (error) {
    console.error(`Error: ${error}`)
  }
}


const paymentResponse = {
  "paymentMethods": [
      {
          "brands": [
              "visa",
              "mc",
              "amex",
              "discover",
              "maestro",
              "diners"
          ],
          "details": [
              {
                  "key": "encryptedCardNumber",
                  "type": "cardToken"
              },
              {
                  "key": "encryptedSecurityCode",
                  "type": "cardToken"
              },
              {
                  "key": "encryptedExpiryMonth",
                  "type": "cardToken"
              },
              {
                  "key": "encryptedExpiryYear",
                  "type": "cardToken"
              },
              {
                  "key": "holderName",
                  "optional": true,
                  "type": "text"
              }
          ],
          "name": "Credit Card",
          "type": "scheme"
      }
  ]
}

const configuration = {
  paymentMethodsResponse: paymentResponse,
  clientKey: 'test_UNGJPZFKU5BZLBBGMCQ3A5URQQIU3JP3',
  locale: 'en-us',
  environment: 'test',
  onSubmit: (state, dropin) => {
    makePayment(state.data)
      .then(response => {
        if (response.action) {

          dropin.handleAction(response.action);
        } else {
          showFinalResult(response);
        }
      })
      .catch(error => {
        throw Error(error);
      });
  },
onAdditionalDetails: (state, dropin) => {
  makeDetailsCall(state.data)
    .then(response => {
      if (response.action) {
        dropin.handleAction(response.action);
      } else {
        showFinalResult(response);
      }
    })
    .catch(error => {
      throw Error(error);
    });
},
paymentMethodsConfiguration: {
  card: {
    hasHolderName: true,
    holderNameRequired: true,
    enableStoreDetails: true,
    hideCVC: false,
    name: 'Credit or debit card',
    onSubmit: () => {},
  }
}
}


const checkout = new AdyenCheckout(configuration);

const dropin = checkout
    .create('dropin', {
        openFirstPaymentMethod:false
    })
   .mount('#dropin-container');

