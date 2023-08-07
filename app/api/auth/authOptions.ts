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
        name:{label:"Name"}
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

};