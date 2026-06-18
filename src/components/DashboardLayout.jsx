import Sidebar from "./Sidebar";
import Header from "./Header";
import { useEffect } from "react";
import api from "@/services/api";

export default function DashboardLayout({ children }) {

  useEffect(() => {
    async function load() {
      const res = await api.get("/company");

      const color = res.data?.settings?.theme?.primary_color;

      if (color) {
        document.documentElement.style.setProperty("--primary", color);
      }
    }

    load();
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-white">
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