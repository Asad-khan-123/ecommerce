import nodemailer from 'nodemailer';
import ENV from './env.js';
import Setting from '../models/settings.js';

// Create a reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_PORT === 465, // true for 465 (SSL), false for other ports (TLS)
    auth: {
      user: ENV.EMAIL_USER,
      pass: ENV.EMAIL_PASS,
    },
    connectionTimeout: 10000, // 10 seconds timeout
  });
};

/**
 * Sends a professional HTML order confirmation email to the customer.
 * Suppresses any internal errors to ensure the order creation process is not interrupted.
 */
export const sendOrderConfirmationEmail = async (order, customerEmail, adminEmails = []) => {
  if (!ENV.EMAIL_USER || !ENV.EMAIL_PASS) {
    console.warn('WARNING: SMTP credentials not set (EMAIL_USER/EMAIL_PASS). Order confirmation email was skipped.');
    return;
  }

  try {
    const transporter = createTransporter();
    
    // Generate beautiful order items HTML list
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
          <p style="margin: 0; font-size: 14px; font-weight: 600; text-transform: uppercase; color: #212121; font-family: 'Poppins', Helvetica, Arial, sans-serif;">${item.title}</p>
          <p style="margin: 3px 0 0; font-size: 11px; color: #888; font-family: 'Poppins', Helvetica, Arial, sans-serif;">Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity}</p>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; font-size: 14px; color: #212121; font-family: 'Poppins', Helvetica, Arial, sans-serif;">
          ₹ ${(item.price * item.quantity).toLocaleString('en-IN')}
        </td>
      </tr>
    `).join('');

    const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = order.shippingFee || 0;
    const total = order.totalAmount || (subtotal + shipping);

    // Fetch custom success message from settings database
    let customSuccessMsg = "Thank you for your order! It has been successfully processed. Here is a summary of your order details:";
    try {
      const dbSetting = await Setting.findOne({ key: 'orderSuccessMessage' });
      if (dbSetting && dbSetting.value) {
        customSuccessMsg = dbSetting.value;
      }
    } catch (dbErr) {
      console.error('Failed to retrieve orderSuccessMessage setting for email:', dbErr);
    }

    const emailHtml = `
      <div style="font-family: 'Poppins', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; color: #212121; background-color: #ffffff; border: 1px solid #e8e8e8; box-sizing: border-box;">
        <!-- Header -->
        <div style="text-align: center; padding-bottom: 25px; border-bottom: 1px solid #f0f0f0;">
          <h2 style="font-weight: 400; letter-spacing: 0.25em; text-transform: uppercase; margin: 0 0 8px; font-size: 20px; color: #212121; font-family: 'Poppins', Helvetica, Arial, sans-serif;">I AM TROUBLE</h2>
          <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.25em; color: #999; margin: 0; font-family: 'Poppins', Helvetica, Arial, sans-serif;">Order Confirmation</p>
        </div>

        <!-- Body -->
        <div style="padding: 25px 0;">
          <p style="font-size: 14px; line-height: 1.6; margin: 0 0 12px; font-family: 'Poppins', Helvetica, Arial, sans-serif;">Hi ${order.shippingAddress?.fullName || 'Customer'},</p>
          <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px; font-family: 'Poppins', Helvetica, Arial, sans-serif; color: #555;">${customSuccessMsg}</p>
          
          <!-- Order Info Card -->
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin-bottom: 25px; border: 1px solid #f0f0f0;">
            <p style="margin: 0 0 8px; font-size: 12px; color: #666; font-family: 'Poppins', Helvetica, Arial, sans-serif;"><strong>Order ID:</strong> <span style="color:#212121;">${order._id}</span></p>
            <p style="margin: 0 0 8px; font-size: 12px; color: #666; font-family: 'Poppins', Helvetica, Arial, sans-serif;"><strong>Date:</strong> <span style="color:#212121;">${new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span></p>
            <p style="margin: 0; font-size: 12px; color: #666; font-family: 'Poppins', Helvetica, Arial, sans-serif;"><strong>Payment Status:</strong> <span style="color:#212121; text-transform:uppercase;">${order.paymentStatus}</span></p>
          </div>

          <!-- Items Table -->
          <h4 style="text-transform: uppercase; letter-spacing: 0.15em; font-size: 11px; margin: 0 0 10px; border-bottom: 2px solid #212121; padding-bottom: 6px; font-family: 'Poppins', Helvetica, Arial, sans-serif; font-weight: 600;">Your Selection</h4>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Pricing Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #666; font-family: 'Poppins', Helvetica, Arial, sans-serif;">Subtotal</td>
              <td style="padding: 6px 0; font-size: 13px; color: #666; text-align: right; font-family: 'Poppins', Helvetica, Arial, sans-serif;">₹ ${subtotal.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #666; font-family: 'Poppins', Helvetica, Arial, sans-serif;">Shipping</td>
              <td style="padding: 6px 0; font-size: 13px; color: #666; text-align: right; font-family: 'Poppins', Helvetica, Arial, sans-serif;">${shipping === 0 ? '<span style="color:#16a34a;">FREE</span>' : `₹ ${shipping.toLocaleString('en-IN')}`}</td>
            </tr>
            <tr style="border-top: 1px solid #e8e8e8;">
              <td style="padding: 12px 0 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Poppins', Helvetica, Arial, sans-serif;">Total Amount</td>
              <td style="padding: 12px 0 0; font-size: 16px; font-weight: bold; text-align: right; color: #212121; font-family: 'Poppins', Helvetica, Arial, sans-serif;">₹ ${total.toLocaleString('en-IN')}</td>
            </tr>
          </table>

          <!-- Shipping Details -->
          <h4 style="text-transform: uppercase; letter-spacing: 0.15em; font-size: 11px; margin: 0 0 10px; border-bottom: 2px solid #212121; padding-bottom: 6px; font-family: 'Poppins', Helvetica, Arial, sans-serif; font-weight: 600;">Delivery Details</h4>
          <p style="font-size: 13px; line-height: 1.6; margin: 0; color: #555; font-family: 'Poppins', Helvetica, Arial, sans-serif;">
            <strong style="color:#212121;">${order.shippingAddress?.fullName}</strong><br/>
            ${order.shippingAddress?.addressLine1}<br/>
            ${order.shippingAddress?.addressLine2 ? `${order.shippingAddress.addressLine2}<br/>` : ''}
            ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.postalCode}<br/>
            ${order.shippingAddress?.country}<br/>
            Contact: ${order.shippingAddress?.phone}
          </p>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #e8e8e8; padding-top: 25px; text-align: center; font-size: 11px; color: #999; line-height: 1.6;">
          <p style="margin: 0 0 8px; font-family: 'Poppins', Helvetica, Arial, sans-serif;">For any queries regarding custom sizing or order adjustments, reply directly to this mail or contact us at <a href="mailto:orders@iamtroublebykc.com" style="color: #212121; text-decoration: underline;">orders@iamtroublebykc.com</a></p>
          <p style="margin: 0; font-family: 'Poppins', Helvetica, Arial, sans-serif;">&copy; ${new Date().getFullYear()} I AM TROUBLE BY KC. All Rights Reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"I AM TROUBLE BY KC" <${ENV.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Order Confirmation — #${order._id}`,
      html: emailHtml,
    };

    if (adminEmails && adminEmails.length > 0) {
      mailOptions.bcc = adminEmails;
    } else {
      mailOptions.bcc = ENV.EMAIL_USER;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully. Msg ID:', info.messageId);
    return info;
  } catch (error) {
    // Graceful catch to avoid blocking API response
    console.error('Nodemailer Error: Order creation succeeded but confirmation email failed to send:', error);
  }
};
