const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

const sendInviteEmail = async ({ to, name, inviter, groupName }) => {
  const mailOptions = {
    from: `"Group App" <${process.env.EMAIL_USER}>`,
    to,
    subject: `You're invited to join ${groupName}!`,
    html: `
      <p>Hi ${name},</p>
      <p><strong>${inviter}</strong> has invited you to join the group <strong>${groupName}</strong>.</p>
      <p>Please <a href="http://localhost:3000/login">login</a> or <a href="http://localhost:3000/register">register</a> to accept the invitation.</p>
      <p>Thanks,<br/>GroupApp Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendInviteEmail;
