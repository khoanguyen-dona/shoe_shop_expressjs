const router = require('express').Router()
const formatCurrency = require('.././Utils/formatCurrency')
const transporter = require('../aws-ses')

router.post('/send-order-verification', async (req, res) => {
    try {
      const { customerEmail, orderDetails } = req.body;
  
      // Validate request body
      if (!customerEmail || !orderDetails || orderDetails.length === 0) {
        return res.status(400).json({ message: 'Customer email and order details are required' });
      }
  
      // Create HTML content for email
      const emailHtmlContent = `
        <h2>Xác nhận đơn hàng</h2>
        <p>Chúng tôi đã nhận được đơn hàng!</p>
        <table border="1" cellpadding="10" cellspacing="0">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Ảnh</th>
              <th>Số lượng</th>
              <th>Giá tiền</th>
            </tr>
          </thead>
          <tbody>
            ${orderDetails
              .map(
                (item) => `
              <tr>
                <td>${item.name}</td>
                <td><img src="${item.thumbnail}" alt="${item.name}" style="width: 100px; height: auto;" /></td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.price)} </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <p>Total: ${formatCurrency(orderDetails.reduce((total, item) => total + item.quantity * item.price, 0))} </p>
      `;
  
      // Email options
      const mailOptions = {
        from: 'ShoeShop@donawebs.com', // Must be verified in SES
        to: customerEmail,
        subject: 'Order Confirmation - Thank you for your order!',
        html: emailHtmlContent,
      };
  
      // Send email
      const emailResponse = await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'Order confirmation email sent successfully!', emailResponse });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email', error });
    }
});


router.post

module.exports = router