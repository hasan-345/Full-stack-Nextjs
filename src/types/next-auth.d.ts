import "next-auth"
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User{
        _id?:string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string  
    }

    //we will define custom User interface because next auth just add email in user 

    interface Session{
        user:{
            _id?:string;
            isVerified?: boolean;
            isAcceptingMessage?: boolean;
            username?: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT{
        _id?:string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string
    }
}