import { Resend } from 'resend';

const FROM_EMAIL = 'AI Humanizer <support@aihumanizer.life>';

export async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set, skipping email:', subject);
    return;
  }
  
  const resend = new Resend(apiKey);
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
