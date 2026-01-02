import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            await dbConnect();

            if (!credentials?.email || !credentials?.password) {
               throw new Error('Please enter email and password');
            }

            const user = await User.findOne({ email: credentials.email });

            if (!user || !user.password) {
               throw new Error('No user found with this email');
            }

            const isValid = await bcrypt.compare(credentials.password, user.password);

            if (!isValid) {
               throw new Error('Incorrect password');
            }

            return { id: user._id.toString(), name: user.name, email: user.email };
        }
    })
  ],
  session: {
      strategy: "jwt",
  },
  callbacks: {
      async session({ session, token }) {
          if (session?.user) {
              session.user.id = token.sub;
          }
          return session;
      }
  },
  pages: {
      signIn: '/auth/signin',
  }
}
