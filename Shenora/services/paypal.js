const axios = require('axios')

async function generateAccessToken() {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        }
    })
    const axios = require('axios')

    async function generateAccessToken() {
      const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
          username: process.env.PAYPAL_CLIENT_ID,
          password: process.env.PAYPAL_SECRET
        }
      })
    
      return response.data.access_token
    }
    
    exports.createOrder = async (data) => {
    
      const accessToken = await generateAccessToken()
    
      const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        data: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              items: [
                {
                  name: 'T shirt',
                  description: 'white M t-shirt',
                  quantity: 1,
                  unit_amount: {
                    currency_code: 'AUD',
                    value: String(data.total)
                  }
                }
              ],
    
              amount: {
                currency_code: 'AUD',
                value: String(data.total),
                breakdown: {
                  item_total: {
                    currency_code: 'AUD',
                    value: String(data.total)
                  }
                }
              }
            }
          ],
          application_context: {
            return_url: process.env.BASE_URL + `/complete-order?orderNo=${data?.orderNo}`,
            cancel_url: process.env.BASE_URL + '/cancel-order',
            // shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            brand_name: 'Shenora'
          }
        })
      })
      console.log(response);
    
      return response.data.links.find(link => link.rel === 'approve').href
    }
    
    exports.capturePayment = async (orderId) => {
      const accessToken = await generateAccessToken()
    
      const response = await axios({
        url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      })
    
      return response.data
    }
    return response.data.access_token
}

exports.createOrder = async () => {
    const accessToken = await generateAccessToken()

const response = await axios({
    url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
    method: 'post',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
    },
    data: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
            {
                items: [
                    {
                        name: 'T shirt',
                        description: 'white M t-shirt',
                        quantity: 1,
                        unit_amount: {
                            currency_code: 'AUD',
                            value: '100.00'
                        }
                    }
                ],

                amount: {
                    currency_code: 'AUD',
                    value: '100.00',
                    breakdown: {
                        item_total: {
                            currency_code: 'AUD',
                            value: '100.00'
                        }
                    }
                }
            }
        ],

        application_context: {
            return_url: process.env.BASE_URL + '/complete-order',
            cancel_url: process.env.BASE_URL + '/cancel-order',
            // shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            brand_name: 'Shenora'
        }
    })
})

return response.data.links.find(link => link.rel === 'approve').href
}

exports.capturePayment = async (orderId) => {
    const accessToken = await generateAccessToken()

    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    })

    return response.data
}