import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const { name, title, company, email, profile, timestamp } = req.body;

    // Professional HTML email template with applicant data
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #666; }
          .value { color: #333; margin-left: 10px; }
          .signature { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #666; }
          a { color: #3B82F6; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">New Founding Charter Application</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">The Protocol - Sovereign Prospectus</p>
          </div>
          <div class="content">
            <p style="font-size: 16px; color: #666; margin-bottom: 25px;">
              A new application has been submitted for consideration as a founding partner.
            </p>
            
            <div class="field">
              <span class="label">Application Time:</span>
              <span class="value">${new Date(timestamp).toUTCString()}</span>
            </div>
            
            <div class="field">
              <span class="label">Applicant Name:</span>
              <span class="value">${name}</span>
            </div>
            
            <div class="field">
              <span class="label">Title:</span>
              <span class="value">${title}</span>
            </div>
            
            <div class="field">
              <span class="label">Company:</span>
              <span class="value">${company}</span>
            </div>
            
            <div class="field">
              <span class="label">Email:</span>
              <span class="value"><a href="mailto:${email}">${email}</a></span>
            </div>
            
            <div class="field">
              <span class="label">Profile/Project:</span>
              <span class="value">${profile ? `<a href="${profile}">${profile}</a>` : 'Not provided'}</span>
            </div>
            
            <div class="signature">
              <p style="margin: 0 0 10px 0;"><strong>The AgentVault Project Team</strong></p>
              <p style="margin: 0; font-size: 14px;">Building the Economic Infrastructure for Autonomous AI</p>
              <p style="margin: 10px 0 0 0; font-size: 13px;">
                <em>"Where Compute Has Value"</em><br>
                <a href="https://www.linkedin.com/in/raphaeljeziorny/">LinkedIn</a> | 
                AgentVault@proton.me
              </p>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
                This email contains confidential information regarding The Protocol's founding partnership program. 
                Please handle with appropriate discretion.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Resend
	const { data, error } = await resend.emails.send({
	from: 'The Protocol <onboarding@resend.dev>',
	to: 'AgentVault@proton.me', // <- THIS IS THE FIX
	subject: `New Founding Charter Application: ${name} - ${company}`,
	html: emailHtml,
	});

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ message: 'Failed to process application.' });
    }

    return res.status(200).json({ message: 'Application submitted successfully!' });

  } catch (error) {
    console.error('Error processing application:', error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
}