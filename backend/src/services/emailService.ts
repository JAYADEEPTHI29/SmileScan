import nodemailer from 'nodemailer';
import { config } from '../config/env';

let cachedTransporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (cachedTransporter) return cachedTransporter;

  if (config.smtp.host && config.smtp.user && config.smtp.pass) {
    cachedTransporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
    console.log('✅ Real SMTP Transporter initialized:', config.smtp.host);
  } else {
    // Zero-config Ethereal SMTP test account for instant email preview without external setup
    console.log('ℹ️ SMTP credentials not set in .env. Creating test email account via Ethereal...');
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('✅ Ethereal Test SMTP initialized as fallback. Test User:', testAccount.user);
  }

  return cachedTransporter;
}

export async function sendPasswordResetEmail(recipientEmail: string, resetLink?: string): Promise<{ success: boolean; previewUrl?: string | false; message: string }> {
  try {
    const transporter = await getTransporter();

    const actualResetLink = resetLink || `http://localhost:5173/reset-password?email=${encodeURIComponent(recipientEmail)}&token=${Date.now()}`;

    const htmlContent = `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #2563EB, #14B8A6); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">SmileScan AI</h1>
          <p style="color: #dbeafe; margin: 4px 0 0 0; font-size: 13px;">Clinical Decision Support System</p>
        </div>

        <div style="padding: 32px 24px;">
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Hello Practitioner,<br/><br/>
            We received a password reset request for your SmileScan account associated with <b>${recipientEmail}</b>. Click the button below to reset your password:
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${actualResetLink}" style="background-color: #2563EB; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: 700; font-size: 14px; border-radius: 12px; display: inline-block;">
              Reset My Password
            </a>
          </div>

          <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
            If you did not request a password reset, please ignore this email or contact system administration.
          </p>
        </div>

        <div style="background-color: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            © 2026 SmileScan AI Dental Clinical Decision Support System. Enterprise Medical Grade.
          </p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: config.smtp.from,
      to: recipientEmail,
      subject: '🔑 SmileScan Account Password Reset Request',
      text: `SmileScan Password Reset Request\n\nReset link: ${actualResetLink}`,
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('=====================================================');
      console.log('📧 Password Reset Email Dispatched!');
      console.log(`📬 Recipient: ${recipientEmail}`);
      console.log(`🔗 Test Email Inbox Preview URL: ${previewUrl}`);
      console.log('=====================================================');
    }

    return {
      success: true,
      previewUrl,
      message: `Password reset email dispatched to ${recipientEmail}.`,
    };
  } catch (error: any) {
    console.error('❌ Failed to send password reset email:', error);
    return {
      success: false,
      message: error.message || 'Failed to dispatch email.',
    };
  }
}
