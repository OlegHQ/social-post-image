import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Default fallbacks for development
const DEFAULT_PASSWORD = 'swiss';
const DEFAULT_SECRET = 'development-secret-do-not-use-in-production';

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || DEFAULT_SECRET,
  providers: [
    Credentials({
      name: 'Password',
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const password = credentials?.password as string;
        const envPassword = process.env.AUTH_PASSWORD || DEFAULT_PASSWORD;

        if (password === envPassword) {
          return {
            id: '1',
            name: 'User',
            email: 'user@swiss.app',
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
