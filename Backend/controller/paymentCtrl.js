// paymentCtrl.js

// Import PayPal SDK hoặc thư viện cần thiết
const paypal = require('paypal-rest-sdk');

// Configure PayPal SDK
paypal.configure({
  mode: 'sandbox', // Change to 'live' for production
  client_id: 'AUKZzmdy6bbvA0y6Ct1CktKtkXZd-_IFGsdkVCNtW8ot-G66-AWjDmUjknHvBwbd1_ujwWeL8jCzHLwU',
  client_secret: 'ENeaAxtZgKbGBZA1BerODSDp9e9SJwvpvMcnONpRw01Dn9AZUxfBR4lus4Er8AO8IPRVk3JEVa0k4kWt',
});

// Hàm xử lý khi người dùng thực hiện thanh toán (checkout)
const paypalCheckout = async (req, res) => {
  const { amount } = req.body;

  const create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: amount,
        },
        description: 'Payment for your order',
      },
    ],
    redirect_urls: {
      return_url: 'http://localhost:3000/success', // Thay đổi khi deploy
      cancel_url: 'http://localhost:3000/cancel',
    },
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.error('Error creating payment:', error.response);
      return res.status(500).json({ success: false, error: error.response });
    }

    // Trả về paymentId cho frontend để xử lý
    res.status(200).json({ success: true, paymentId: payment.id });
  });
};
// Hàm xử lý xác nhận thanh toán
const paypalPaymentVerification = async (req, res) => {
  const { paymentId, PayerID } = req.body;

  paypal.payment.get(paymentId, function (error, payment) {
    if (error) {
      console.error('Error getting payment details:', error);
      res.status(500).json({ error });
      return;
    }

    const amount = payment.transactions[0].amount.total; // Lấy giá trị thực tế từ payment

    const execute_payment_json = {
      payer_id: PayerID,
      transactions: [
        {
          amount: {
            currency: 'USD',
            total: amount, // Sử dụng giá trị thực tế
          },
        },
      ],
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        console.error('Error executing payment:', error);
        res.status(500).json({ error });
      } else {
        res.status(200).json({ success: true, payment });
      }
    });
  });
};

const capturePayPalOrder = async (req, res) => {
  const { paymentId, payerId } = req.body;

  const execute_payment_json = {
    payer_id: payerId,
  };

  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
      console.error('Error capturing payment:', error.response);
      return res.status(500).json({ success: false, error: error.response });
    }

    // Xử lý dữ liệu sau khi thanh toán thành công
    res.status(200).json({ success: true, payment });
  });
};


module.exports = {
  paypalCheckout,
  paypalPaymentVerification,
  capturePayPalOrder
};
