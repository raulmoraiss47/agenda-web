"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function LoginPage() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e) {

        e.preventDefault();

        try {

            const response = await api.post("/login", {
                email,
                password
            });

            localStorage.setItem(
                "token",
                response.data.token
            );

            router.push("/dashboard");

        } catch (error) {

            alert("Login inválido");

            console.log(error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">

            <form
                onSubmit={handleLogin}
                className="w-full max-w-md p-6 border rounded"
            >

                <h1 className="text-2xl mb-6">
                    Agenda SaaS
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Senha"
                    className="w-full border p-2 mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="w-full p-2 bg-black text-white"
                >
                    Entrar
                </button>

            </form>

        </div>
    );
}