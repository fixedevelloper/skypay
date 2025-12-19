import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        token?: string;
        user: User & { id: string };
    }
    interface User {
        id?: string;
        token?:string
        role?:string
        photoURL?:string
         balance?:number
    }
}