const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Tạo một transporter (dịch vụ sẽ gửi email, ở đây là Gmail)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2) Định nghĩa các tùy chọn cho email
  const mailOptions = {
    from: `Your App Name <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,

  };

  // 3) Thực sự gửi email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;