import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getCloudflareContext } from '@opennextjs/cloudflare';

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

        await db
          .prepare(
            `INSERT INTO users (id, email, name, avatar, plan, trial_used)
             VALUES (?, ?, ?, ?, 'free', 0)
             ON CONFLICT(email) DO UPDATE SET name=excluded.name, avatar=excluded.avatar`
          )
          .bind(user.id ?? email, email, name, avatar)
          .run();

        const row = await db
          .prepare('SELECT plan, trial_used FROM users WHERE email = ?')
          .bind(email)
          .first() as { plan: string; trial_used: number } | null;

        if (row && row.trial_used === 0 && row.plan === 'free') {
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
