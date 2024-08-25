import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs"
import { dbConnection } from "@/lib/dbConfig";
import User from "@/models/User.model";

//please write as it  is
export const authOptions: NextAuthOptions = {
     providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials: any): Promise<any> {
                    await dbConnection();

                    try {
                       const user = await User.findOne({
                            $or: [
                                {email: credentials.identifier},
                                {username: credentials.identifier}
                            ]
                        })

                        if (!user) {
                            throw new Error("No user found with this email or username")
                        }

                        const checkPassword = await bcrypt.compare(credentials.password, user.password)

                        if (!checkPassword) {
                            throw new Error("Invalid password")
                        }


                        return user
                        
                    } catch (error:any) {
                        throw new Error(error)
                    }
              }
        })
     ],

     callbacks: {

        //it is used to store token
        async jwt({ token, user }) {

            //it does not work first of all we do something
            //after that it works
            if (user) {
            token._id = user._id?.toString()
            token.isVerified = user.isVerified
            token.isAcceptingMessage = user.isAcceptingMessage
            token.username = user.username
            }
            
            return token
            
            
          },

        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }
            return session
          }
         
     },

     pages: {
        signIn: "/sign-in"
     },
     session: {
        strategy:"jwt"
     },
     secret: process.env.NEXTAUTH_SECRET,//it is very important

     //you can use any random characters for NEXTAUTH_SECRET = NKDKSDJSKDJSDKSSDMSD
    
}

