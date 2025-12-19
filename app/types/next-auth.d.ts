import NextAuth from "next-auth";

import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        token?: string;
        user: User & { id: string };
    }

    interface User {
        id?: string;
        token?: string;
        phone?: string;
        role?: string;
        photoURL?: string;
        balance?: number;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        token?: string;
        phone?: string;
        role?: string;
        photoURL?: string;
        balance?: number;
    }
}
