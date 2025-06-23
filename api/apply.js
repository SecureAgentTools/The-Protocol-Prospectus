const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const { name, title, company, email, profile, timestamp } = req.body;

    // Transporter configuration uses environment variables which will be set in Vercel.
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // This must be a Google App Password
      },
    });

    await transporter.sendMail({
      from: `"The Protocol Prospectus" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Founding Charter Application: ${name} - ${company}`,
      html: `
        <h1>New Application Received</h1>
        <p><strong>Timestamp:</strong> ${new Date(timestamp).toUTCString()}</p>
        <hr>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Profile:</strong> <a href="${profile}">${profile}</a></p>
      `,
    });

    return res.status(200).json({ message: 'Application submitted successfully!' });

  } catch (error) {
    console.error('Error processing application:', error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
}