import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth/next";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@repo/prisma/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    // signIn: '/auth/signin', // 可選：自定義登錄頁面
    signOut: '/auth/signout', // 可選：自定義登出頁面
    // error: '/auth/error', // 可選：自定義錯誤頁面
  },
  // 其他 NextAuth 配置選項
};

// 封裝 getServerSession 以便在應用中使用
export const auth = () => getServerSession(authOptions);
