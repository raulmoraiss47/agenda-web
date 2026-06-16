import { Home, Calendar, Users, Scissors, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
      
      <h1 className="text-xl font-bold mb-10">
        💈 BarberPro
      </h1>

      <nav className="flex flex-col gap-4 flex-1">
        <a className="flex items-center gap-2 hover:text-blue-400">
          <Home size={18} /> Dashboard
        </a>

        <a className="flex items-center gap-2 hover:text-blue-400">
          <Calendar size={18} /> Agenda
        </a>

        <a className="flex items-center gap-2 hover:text-blue-400">
          <Users size={18} /> Clientes
        </a>

        <a className="flex items-center gap-2 hover:text-blue-400">
          <Scissors size={18} /> Serviços
        </a>
      </nav>

      <button className="flex items-center gap-2 text-red-400 hover:text-red-300">
        <LogOut size={18} /> Sair
      </button>
    </aside>
  );
}