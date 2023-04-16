import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@admin/lib/mongodb";
import NextAuth, { getServerSession } from "next-auth/next";
import { AuthOptions } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";

const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

export const authOptions: AuthOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ session, token, user }) =>
      session.user?.email && adminEmails.includes(session.user.email)
        ? session
        : (false as any),
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email || !adminEmails.includes(session.user.email)) {
    res.status(403);
    res.end();
    throw new Error("Forbidden");
  }
}
