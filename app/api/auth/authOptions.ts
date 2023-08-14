import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import mongoose from 'mongoose'
import User from "../models/User";

export const authOptions: NextAuthOptions = {
  providers: [

    Credentials({

      name: "Credentials",
      credentials: {
        email: { label: "Email" },
        password: { label: "Password" },
      },
      
      
      async authorize(credentials, req) {

        await mongoose.connect(process.env.MONGODB_URL as string)
        const user = await User.findOne({ email: credentials?.email,password:credentials?.password});
        
        if(user) {return user}

        return null
        
      },

    }),
  
  ],

  pages:{
    signIn:"/login",
  },

  callbacks:{

    async jwt({token,user,trigger,session,account}){
      
      if(trigger==="update"){
        return {...token,...session.user}
      }

      if(user) {
        token.role=user.role
        token.plan=user.plan 
        token.id = user._id 
      }
      
      return token
    },

    async session({session,token}){
      if(session?.user) { 
        session.user.role= token.role
        session.user.plan=token.plan
        session.user.id = token.id
        
      }
      return session
    }

  }

};