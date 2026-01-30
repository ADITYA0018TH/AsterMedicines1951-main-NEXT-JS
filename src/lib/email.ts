import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export interface SendPasswordResetEmailParams {
  to: string;
  resetUrl: string;
}

export const sendPasswordResetEmail = async ({
  to,
  resetUrl,
}: SendPasswordResetEmailParams): Promise<void> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || `"Aster Medicines" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Password Reset Request - Aster Medicines Admin',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #e4e4e7;">
                      <img src="https://astermedicines.com/My-uploads/logo.webp" alt="Aster Medicines" style="height: 60px; width: auto;">
                      <p style="margin: 16px 0 0; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #71717a;">Admin Portal</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #18181b;">Password Reset Request</h1>
                      <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #52525b;">
                        We received a request to reset your password for the Aster Medicines Admin Portal. Click the button below to create a new password.
                      </p>
                      
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td align="center" style="padding: 16px 0;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 16px 32px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #ffffff; background-color: #FE5C02; text-decoration: none; border-radius: 8px;">
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #71717a;">
                        This link will expire in <strong>1 hour</strong>. If you didn't request this reset, you can safely ignore this email.
                      </p>
                      
                      <hr style="margin: 32px 0; border: none; border-top: 1px solid #e4e4e7;">
                      
                      <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                        If the button doesn't work, copy and paste this URL into your browser:
                      </p>
                      <p style="margin: 8px 0 0; font-size: 12px; color: #FE5C02; word-break: break-all;">
                        ${resetUrl}
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 40px; background-color: #fafafa; border-radius: 0 0 12px 12px; border-top: 1px solid #e4e4e7;">
                      <p style="margin: 0; font-size: 12px; color: #71717a; text-align: center;">
                        &copy; ${new Date().getFullYear()} Aster Medicines Pvt. Ltd. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
      Password Reset Request - Aster Medicines Admin
      
      We received a request to reset your password for the Aster Medicines Admin Portal.
      
      Click this link to reset your password: ${resetUrl}
      
      This link will expire in 1 hour. If you didn't request this reset, you can safely ignore this email.
      
      © ${new Date().getFullYear()} Aster Medicines Pvt. Ltd.
    `,
  };

  await transporter.sendMail(mailOptions);
};
