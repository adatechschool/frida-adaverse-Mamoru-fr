import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import db from "@/lib/db/index"; // Change l'import en fonction de TON projet
import * as schema from "@/lib/db/schema"; // Change l'import en fonction de TON projet
import {nextCookies} from "better-auth/next-js";
import {admin} from "better-auth/plugins";

// Dynamic base URL: use VERCEL_URL in production, localhost in development
const getBaseUrl = () => {
    if (process.env.BETTER_AUTH_URL) {
        return process.env.BETTER_AUTH_URL;
    }
    
    // Production: Vercel
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    
    // Development: localhost
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
};

export const auth = betterAuth({
    baseURL: getBaseUrl(),
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
        enabled: true, // On active les comptes par email et mot de passe
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema, // Ajoute ton schéma de DB
    }),
    plugins: [
        nextCookies(), // ⚠ Permet de sauvegarder les cookies better-auth dans l'appli next
        admin(), // Adds role and banned fields to users
    ],
});