import {
  Home,
  Calendar,
  Users,
  Briefcase,
  Settings,
  LogOut,
  UserCog,
  MessageCircle,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  const itemBase =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200";

  // Classes dinâmicas baseadas no tema configurado
  const activeClass =
    "bg-custom-primary/10 text-custom-primary border-l-4 border-custom-primary font-medium";

  const inactiveClass =
    "text-custom-text opacity-70 hover:opacity-100 hover:bg-black/10";

  return (
    <aside className="w-64 bg-custom-card border-r border-white/10 p-6 flex flex-col transition-colors duration-500">
      
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-custom-primary transition-colors duration-500">
          AgendaPro
        </h1>
        <p className="text-xs opacity-60 mt-1">
          Cloud Platform
        </p>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
        <Link
          href="/dashboard"
          className={`${itemBase} ${
            isActive("/dashboard") ? activeClass : inactiveClass
          }`}
        >
          <Home size={18} className={isActive("/dashboard") ? "text-custom-primary" : "opacity-70"} />
          Dashboard
        </Link>

        <Link
          href="/agenda"
          className={`${itemBase} ${
            isActive("/agenda") ? activeClass : inactiveClass
          }`}
        >
          <Calendar size={18} className={isActive("/agenda") ? "text-custom-primary" : "opacity-70"} />
          Agenda
        </Link>

        <Link
          href="/clientes"
          className={`${itemBase} ${
            isActive("/clientes") ? activeClass : inactiveClass
          }`}
        >
          <Users size={18} className={isActive("/clientes") ? "text-custom-primary" : "opacity-70"} />
          Clientes
        </Link>

        <Link
          href="/profissionais"
          className={`${itemBase} ${
            isActive("/profissionais") ? activeClass : inactiveClass
          }`}
        >
          <UserCog size={18} className={isActive("/profissionais") ? "text-custom-primary" : "opacity-70"} />
          Profissionais
        </Link>

        <Link
          href="/servicos"
          className={`${itemBase} ${
            isActive("/servicos") ? activeClass : inactiveClass
          }`}
        >
          <Briefcase size={18} className={isActive("/servicos") ? "text-custom-primary" : "opacity-70"} />
          Serviços
        </Link>

        {/* NOVOS LINKS AQUI */}
        <Link
          href="/whatsapp"
          className={`${itemBase} ${
            isActive("/whatsapp") ? activeClass : inactiveClass
          }`}
        >
          <MessageCircle size={18} className={isActive("/whatsapp") ? "text-custom-primary" : "opacity-70"} />
          WhatsApp
        </Link>

        <Link
          href="/assinaturas"
          className={`${itemBase} ${
            isActive("/assinaturas") ? activeClass : inactiveClass
          }`}
        >
          <CreditCard size={18} className={isActive("/assinaturas") ? "text-custom-primary" : "opacity-70"} />
          Assinatura
        </Link>

        <Link
          href="/configuracoes"
          className={`${itemBase} ${
            isActive("/configuracoes") ? activeClass : inactiveClass
          }`}
        >
          <Settings size={18} className={isActive("/configuracoes") ? "text-custom-primary" : "opacity-70"} />
          Configurações
        </Link>
      </nav>

      {/* LOGOUT */}
      <div className="pt-4 border-t border-white/10 mt-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors">
          <LogOut size={18} />
          Sair
        </button>
      </div>

    </aside>
  );
}