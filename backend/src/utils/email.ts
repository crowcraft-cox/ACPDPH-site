import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // Direct real email transmission via SMTP if configured in Render
    if (host && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
      });

      const from = process.env.SMTP_FROM || `Bright African ONG <${user}>`;

      await transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html || options.text.replace(/\n/g, '<br/>'),
      });

      console.log(`[Email Sent] ✅ Real email sent to inbox: ${options.to}`);
      return true;
    } else {
      console.log(`[Email Log] To: ${options.to} | Subject: ${options.subject}`);
      return true;
    }
  } catch (error: any) {
    console.error('[Email Error]: Failed to send email via SMTP:', error.message);
    return false;
  }
};
