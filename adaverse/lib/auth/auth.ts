import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import db from "@/lib/db/index"; // Change l'import en fonction de TON projet
import * as schema from "@/lib/db/schema"; // Change l'import en fonction de TON projet
import {nextCookies} from "better-auth/next-js";
import {admin} from "better-auth/plugins";

export const auth = betterAuth({
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