import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">

      {/* Pesquisa */}
      <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-xl w-80">
        <Search size={18} className="text-slate-400" />

        <input
          type="text"
          placeholder="Pesquisar..."
          className="
            bg-transparent
            outline-none
            text-sm
            text-white
            placeholder:text-slate-400
            w-full
          "
        />
      </div>

      {/* Usuário */}
      <div className="flex items-center gap-5">

        <button className="relative">
          <Bell
            size={20}
            className="text-slate-300 hover:text-white transition"
          />

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
          <div className="
            w-10
            h-10
            rounded-full
            bg-blue-600
            flex
            items-center
            justify-center
            font-semibold
          ">
            R
          </div>

          <div>
            <p className="text-sm font-medium">
              Raul Morais
            </p>

            <p className="text-xs text-slate-400">
              Administrador
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}