import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { sendEmail } from '@/lib/email';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        const email = user.email;
        const name = user.name || '';
        const avatar = user.image || '';
        if (!email) return true;

        const ctx = await getCloudflareContext({ async: true });
        const db = (ctx.env as any).DB;
        if (!db) return true;

        const existing = await db
          .prepare('SELECT id, trial_used FROM users WHERE email = ?')
          .bind(email)
          .first() as { id: string; trial_used: number } | null;

        if (!existing) {
          // 新注册用户
          await db
            .prepare(
              `INSERT INTO users (id, email, name, avatar, plan, trial_used, pro_expires_at)
               VALUES (?, ?, ?, ?, 'pro', 1, ?)`
            )
            .bind(user.id ?? email, email, name, avatar, Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60)
            .run();

          // 发送欢迎邮件
          await sendEmail(
            email,
            'Welcome to AI Humanizer! ✦',
            `
            <h1>Welcome, ${name}!</h1>
            <p>You now have 3 days of Pro access to AI Humanizer.</p>
            <p>Try our three writing modes: Standard, Academic, and Creative.</p>
            <a href="https://aihumanizer.life" style="padding: 12px 24px; background: #7c3aed; color: #fff; text-decoration: none; border-radius: 20px;">Start Writing</a>
            `
          );
        } else if (existing.trial_used === 0) {
          // 之前注册但没触发过试用的用户（兜底）
          const trialExpiry = Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60;
          await db
            .prepare('UPDATE users SET plan=?, pro_expires_at=?, trial_used=1 WHERE email=?')
            .bind('pro', trialExpiry, email)
            .run();
        }
      } catch (e) {
        console.error('signIn callback error:', e);
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };
