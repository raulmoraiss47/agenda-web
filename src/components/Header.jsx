"use client";

import { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import api from "@/services/api";

export default function Header() {
  const [company, setCompany] = useState(null);

  // Busca os dados da empresa para obter a logo e o nome
  useEffect(() => {
    async function loadCompanyHeader() {
      try {
        const response = await api.get("/company");
        setCompany(response.data);
      } catch (error) {
        console.error("Erro ao carregar dados da empresa no Header:", error);
      }
    }

    loadCompanyHeader();
  }, []);

  return (
    <header className="h-16 bg-custom-card border-b border-white/10 px-6 flex items-center justify-between transition-colors duration-500 text-custom-text">

      {/* Pesquisa */}
      <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-xl w-80 border border-white/5 transition-colors">
        <Search size={18} className="opacity-50" />

        <input
          type="text"
          placeholder="Pesquisar..."
          className="
            bg-transparent
            outline-none
            text-sm
            text-custom-text
            placeholder:opacity-50
            w-full
          "
        />
      </div>

      {/* Usuário / Empresa */}
      <div className="flex items-center gap-5">

        <button className="relative opacity-70 hover:opacity-100 transition-opacity">
          <Bell size={20} />

          <span className="
            absolute
            -top-1
            -right-1
            w-2
            h-2
            bg-red-500
            rounded-full
          " />
        </button>

        <div className="flex items-center gap-3">
          {/* Avatar / Logo Dinâmica */}
          <div className="
            w-10
            h-10
            rounded-full
            bg-custom-primary
            text-white
            flex
            items-center
            justify-center
            font-semibold
            overflow-hidden
            transition-colors
            duration-500
            shadow-md
          ">
            {company?.logo ? (
              <img
                src={`http://127.0.0.1:9000/storage/${company.logo}`}
                alt={company.name || "Logo"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{company?.name ? company.name.charAt(0) : "R"}</span>
            )}
          </div>

          <div>
            <p className="text-sm font-medium">
              {company?.name || "Raul Morais"}
            </p>

            <p className="text-xs opacity-60">
              Administrador
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}