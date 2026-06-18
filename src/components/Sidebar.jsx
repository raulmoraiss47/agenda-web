import {
  Home,
  Calendar,
  Users,
  Briefcase,
  Settings,
  LogOut,
  UserCog,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  const itemBase =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200";

  const activeClass =
    "bg-[var(--primary)]/20 text-white border-l-4 border-[var(--primary)]";

  const inactiveClass =
    "text-slate-300 hover:bg-slate-800 hover:text-white";

  const iconStyle = (active) => ({
    color: active ? "var(--primary)" : "#94a3b8",
  });

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-white p-6 flex flex-col">

      {/* Logo */}
      <div className="mb-10">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--primary)" }}
        >
          AgendaPro
        </h1>

        <p className="text-xs text-slate-400 mt-1">
          Cloud Platform
        </p>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2 flex-1">

        <Link
          href="/dashboard"
          className={`${itemBase} ${
            isActive("/dashboard") ? activeClass : inactiveClass
          }`}
        >
          <Home size={18} style={iconStyle(isActive("/dashboard"))} />
          Dashboard
        </Link>

        <Link
          href="/agenda"
          className={`${itemBase} ${
            isActive("/agenda") ? activeClass : inactiveClass
          }`}
        >
          <Calendar size={18} style={iconStyle(isActive("/agenda"))} />
          Agenda
        </Link>

        <Link
          href="/clientes"
          className={`${itemBase} ${
            isActive("/clientes") ? activeClass : inactiveClass
          }`}
        >
          <Users size={18} style={iconStyle(isActive("/clientes"))} />
          Clientes
        </Link>

        <Link
          href="/profissionais"
          className={`${itemBase} ${
            isActive("/profissionais") ? activeClass : inactiveClass
          }`}
        >
          <UserCog size={18} style={iconStyle(isActive("/profissionais"))} />
          Profissionais
        </Link>

        <Link
          href="/servicos"
          className={`${itemBase} ${
            isActive("/servicos") ? activeClass : inactiveClass
          }`}
        >
          <Briefcase size={18} style={iconStyle(isActive("/servicos"))} />
          Serviços
        </Link>

        <Link
          href="/configuracoes"
          className={`${itemBase} ${
            isActive("/configuracoes") ? activeClass : inactiveClass
          }`}
        >
          <Settings size={18} style={iconStyle(isActive("/configuracoes"))} />
          Configurações
        </Link>

      </nav>

      {/* LOGOUT */}
      <div className="pt-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10">
          <LogOut size={18} />
          Sair
        </button>
      </div>

    </aside>
  );
}