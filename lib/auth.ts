import NextAuth from "next-auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
          const remainingMs = new Date(user.lockUntil).getTime() - Date.now();
          const remainingMinutes = Math.max(1, Math.ceil(remainingMs / (60 * 1000)));
          throw new Error(`LOCKED_${remainingMinutes}`);
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          const newAttempts = user.failedAttempts + 1;
          const shouldLock = newAttempts >= 5;
          await db.user.update({
            where: { id: user.id },
            data: {
              failedAttempts: newAttempts,
              lockUntil: shouldLock ? new Date(Date.now() + 15 * 60 * 1000) : null,
            },
          });
          return null;
        }

        if (user.failedAttempts > 0 || user.lockUntil) {
          await db.user.update({
            where: { id: user.id },
            data: { failedAttempts: 0, lockUntil: null },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && "role" in user) {
        token.sub = user.id;
        token.role = user.role;
        token.isActive = user.isActive;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role ?? "TECNICO";
        session.user.isActive = token.isActive ?? true;
      }
      return session;
    },
  },
});