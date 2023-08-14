// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation

import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string,
            role: string,
            plan:string,
            _id:string,
            name:string,
            image:string,
            email:string
        } & DefaultSession
    }

    interface User extends DefaultUser {
        role: string,
        plan:string,
        _id:string,
        name:string,
        image:string,
        email:string
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        role: string,
        plan:string,
        id:string,
        name:string,
        image:string,
        email:string
    }
}