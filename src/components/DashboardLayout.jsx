import Sidebar from "./Sidebar";
import Header from "./Header";
import { useEffect } from "react";
import api from "@/services/api";

export default function DashboardLayout({ children }) {

  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await api.get("/company");
        const theme = res.data?.settings?.theme;

        if (theme) {
          const root = document.documentElement;
          root.style.setProperty('--color-primary', theme.primary_color);
          root.style.setProperty('--color-bg', theme.bg_color);
          root.style.setProperty('--color-card', theme.card_color);
          root.style.setProperty('--color-text', theme.text_color);
        }
      } catch (error) {
        console.error("Erro ao carregar o tema da empresa:", error);
      }
    }

    loadTheme();
  }, []);

  return (
    // O container raiz agora obedece ao fundo e ao texto customizados
    <div className="flex h-screen bg-custom-bg text-custom-text transition-colors duration-500">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}