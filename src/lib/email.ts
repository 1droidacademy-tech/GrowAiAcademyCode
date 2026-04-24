import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set in environment variables. Email delivery will likely fail.");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_CONFIG = {
  from: "GrowAiEdu <support@growaiedu.in>",
  supportEmail: "growaiadmin@gmail.com",
};

export function getResetPasswordEmail(userName: string, resetLink: string) {
  return `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1e293b; background-color: #f8fafc;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
        <h1 style="font-size: 24px; font-weight: 800; color: #4f46e5; margin-bottom: 24px;">Reset Your Password</h1>
        <p style="font-size: 16px; line-height: 24px; margin-bottom: 16px;">Hi ${userName},</p>
        <p style="font-size: 16px; line-height: 24px; margin-bottom: 32px;">We received a request to reset the password for your GrowAiEdu account. Click the button below to choose a new password. This link will expire in 1 hour.</p>
        
        <a href="${resetLink}" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);">
          Reset Password
        </a>
        
        <p style="font-size: 14px; line-height: 20px; color: #64748b; margin-top: 40px; border-top: 1px solid #e2e8f0; pt: 24px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
        <p style="font-size: 14px; color: #94a3b8; margin-top: 12px;">
          Button not working? Copy and paste this link: <br/>
          <a href="${resetLink}" style="color: #6366f1; word-break: break-all;">${resetLink}</a>
        </p>
      </div>
      <div style="text-align: center; margin-top: 24px;">
        <p style="font-size: 12px; color: #94a3b8;">&copy; 2026 GrowAiEdu India. Future-Ready Education.</p>
      </div>
    </div>
  `;
}

