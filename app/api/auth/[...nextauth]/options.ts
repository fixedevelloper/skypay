import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {randomBytes} from "crypto";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                phone: {label: "Téléphone", type: "text", placeholder: "Entrez votre téléphone"},
                password: {label: "Mot de passe", type: "password"},
            },

            async authorize(credentials) {
                console.log('geasss')
                if (!credentials?.phone || !credentials?.password) {
                    throw new Error("Téléphone et mot de passe requis");
                }

                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            phone: credentials.phone,
                            password: credentials.password,
                        }),
                    });

                    console.log("API response status:", res.status);
                    const result = await res.json();
                    console.log("API response data:", result);

                    if (!res.ok) {
                        throw new Error(result.message || "Erreur serveur");
                    }

                    if (result.status === "success" && result.data?.token) {
                        return {
                            id: result.data.id,
                            name: result.data.name,
                            phone: result.data.phone || null,
                            token: result.data.token,
                            roles: result.data.roles || "customer",
                        };
                    }

                    throw new Error(result.message || "Identifiants invalides");
                } catch (error: any) {
                    console.error("🔥 Erreur authorize():", error);
                    throw new Error("Impossible de se connecter au serveur");
                }
            },
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET ?? "fallback_secret_key",

    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24h
        generateSessionToken: () => randomBytes(32).toString("hex"),
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.token = user.token;
                token.phone = user.phone;
                token.roles = user.roles;
                token.photoURL = user.photoURL;
                token.balance = user.balance;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!;
                session.user.token = token.token;
                session.user.phone = token.phone;
                session.user.roles = token.roles;
                session.user.photoURL = token.photoURL;
                session.user.balance = token.balance;
            }
            return session;
        },
    },
};
