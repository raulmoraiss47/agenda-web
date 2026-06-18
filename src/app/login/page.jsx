"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ShieldCheck } from "lucide-react";
import api from "@/services/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.token
      );

      router.push("/dashboard");

    } catch (error) {
      alert("Login inválido");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-6xl grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">

        {/* LADO ESQUERDO */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-indigo-700">

          <div className="max-w-md text-white">

            <div className="flex items-center gap-3 mb-6">
              <CalendarDays size={40} />
              <h1 className="text-4xl font-bold">
                AgendaPro
              </h1>
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Gerencie seu negócio com eficiência.
            </h2>

            <p className="text-blue-100 text-lg">
              Controle clientes, profissionais, serviços e
              agendamentos em uma única plataforma.
            </p>

            <div className="mt-10 flex items-center gap-3">
              <ShieldCheck />
              <span>
                Ambiente seguro e preparado para crescimento.
              </span>
            </div>

          </div>

        </div>

        {/* LADO DIREITO */}
        <div className="p-8 lg:p-12 flex items-center justify-center">

          <form
            onSubmit={handleLogin}
            className="w-full max-w-md"
          >

            <div className="mb-8">

              <h2 className="text-3xl font-bold text-white">
                Entrar
              </h2>

              <p className="text-slate-400 mt-2">
                Acesse sua conta para continuar.
              </p>

            </div>

            <div className="space-y-4">

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  E-mail
                </label>

                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                  className="
                    w-full
                    bg-slate-800
                    border
                    border-slate-700
                    rounded-xl
                    px-4
                    py-3
                    text-white
                    outline-none
                    focus:border-blue-500
                  "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Senha
                </label>

                <input
                  type="password"
                  placeholder="Digite sua senha"
                  className="
                    w-full
                    bg-slate-800
                    border
                    border-slate-700
                    rounded-xl
                    px-4
                    py-3
                    text-white
                    outline-none
                    focus:border-blue-500
                  "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                mt-6
                bg-blue-600
                hover:bg-blue-700
                disabled:opacity-70
                text-white
                py-3
                rounded-xl
                font-medium
                transition
              "
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <p className="text-center text-sm text-slate-500 mt-6">
              © 2026 AgendaPro
            </p>

          </form>

        </div>

      </div>

    </div>
  );
}