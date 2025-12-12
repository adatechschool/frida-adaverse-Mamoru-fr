"use server";
import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

export const signup = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    
    if (!name && !email && !password && !confirmPassword) {
        throw Error("Name, email, password and confirm password are required");
    }

    if (password !== confirmPassword) {
        throw Error("Passwords do not match");
    }
    
    const response = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        },
        asResponse: true,
    });
    if (!response.ok) {
        console.error("Sign in failed:", await response.json());
        redirect("/auth/signup?error=true");
    }
    redirect("/"); // on redirige vers la home page une fois connecté
};

export const signin = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!email && !password) {
        throw Error("email and password are required");
    }
    const response = await auth.api.signInEmail({
        body: {
            email,
            password,
        },
        asResponse: true,
    });
    if (!response.ok) {
        console.error("Sign in failed:", await response.json());
        redirect("/auth/signin?error=true");
    }
    redirect("/"); // on redirige vers la home page une fois connecté
};

export const signout = async () => {
    await auth.api.signOut({headers: await headers()}); // attention à bien passer les headers !
};