import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";

const isProduction = process.env.NODE_ENV === "production";
const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "your_jwt_secret_key_here_please_change_in_prod";

if (isProduction && !process.env.NEXTAUTH_SECRET) {
  console.warn("⚠️ WARNING: NEXTAUTH_SECRET is not set in production. NextAuth may fail with a Configuration error.");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const { email, password } = credentials;

        // 1. Check against Database FIRST (allows password reset to work)
        try {
          await connectDB();
          const user = await User.findOne({ email: email.toLowerCase() });

          if (user) {
            // User exists in database - use database password
            const isMatch = await user.comparePassword(password);

            if (isMatch) {
              return {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                name: user.name || "Admin User"
              };
            }
            // If password doesn't match database, don't fall back to env
            // This ensures reset passwords take priority
            return null;
          }
        } catch (error) {
          console.error("Auth DB error:", error);
        }

        // 2. Fall back to Environment Variables (Hardcoded Admin) if no DB user
        if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD &&
            email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase() && 
            password === process.env.ADMIN_PASSWORD) {
          return {
            id: "static_admin_id",
            email: email,
            role: "admin",
            name: "Administrator"
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: secret,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
