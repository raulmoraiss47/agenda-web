"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";

import {
  Search,
  Plus,
  User,
  Mail,
  Phone,
  Pencil,
  Trash2
} from "lucide-react";

export default function ClientesPage() {

  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  async function loadClientes() {
    try {
      const response = await api.get("/clients");
      setClientes(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {

    const confirmar = confirm(
      "Deseja realmente excluir este cliente?"
    );

    if (!confirmar) return;

    try {

      await api.delete(`/clients/${id}`);

      loadClientes();

    } catch (error) {

      console.error(error);

      alert("Erro ao excluir cliente");
    }
  }

  async function handleSave() {
    try {

      if (clienteSelecionado.id) {

        await api.put(
          `/clients/${clienteSelecionado.id}`,
          clienteSelecionado
        );

      } else {

        await api.post(
          "/clients",
          clienteSelecionado
        );

      }

      setModalOpen(false);

      loadClientes();

    } catch (error) {

      console.error(error);

      alert("Erro ao salvar cliente");
    }
  }

  function handleEdit(cliente) {
    setClienteSelecionado(cliente);
    setModalOpen(true);
  }

  useEffect(() => {
    loadClientes();
  }, []);

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.name
      ?.toLowerCase()
      .includes(busca.toLowerCase())
  );

  return (
    <DashboardLayout>

      {/* TOPO */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Clientes
          </h1>

          <p className="text-slate-400 mt-1">
            Gerencie sua base de clientes
          </p>
        </div>

        <button
          onClick={() => {
            setClienteSelecionado({
              name: "",
              phone: "",
              email: ""
            });

            setModalOpen(true);
          }}
          className="
            bg-blue-600
            hover:bg-blue-700
            px-5
            py-3
            rounded-xl
            flex
            items-center
            gap-2
            transition
          "
        >
          <Plus size={18} />
          Novo Cliente
        </button>

      </div>

      {/* PESQUISA */}
      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-4
          mb-6
        "
      >
        <div className="flex items-center gap-3">

          <Search size={18} />

          <input
            type="text"
            placeholder="Pesquisar cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="
              flex-1
              bg-transparent
              outline-none
            "
          />

        </div>
      </div>

      {/* TABELA */}
      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          overflow-hidden
        "
      >

        <table className="w-full">

          <thead className="bg-slate-950">

            <tr>

              <th className="text-left p-4">
                Cliente
              </th>

              <th className="text-left p-4">
                Telefone
              </th>

              <th className="text-left p-4">
                Email
              </th>

              <th className="text-left p-4">
                Ações
              </th>

            </tr>

          </thead>

          <tbody>

            {clientesFiltrados.map((cliente) => (

              <tr
                key={cliente.id}
                className="
                  border-t
                  border-slate-800
                  hover:bg-slate-800/50
                  transition
                "
              >

                <td className="p-4">

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        w-10
                        h-10
                        rounded-full
                        bg-blue-600
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <User size={18} />
                    </div>

                    <div>

                      <p className="font-medium">
                        {cliente.name}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="p-4">

                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    {cliente.phone}
                  </div>

                </td>

                <td className="p-4">

                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    {cliente.email || "-"}
                  </div>

                </td>

                <td className="p-4">

                  <div className="flex gap-3">

                    <button
                      onClick={() => handleEdit(cliente)}
                      className="
                        p-2
                        rounded-lg
                        bg-blue-600
                        hover:bg-blue-700
                      "
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(cliente.id)}
                      className="
                        p-2
                        rounded-lg
                        bg-red-600
                        hover:bg-red-700
                      "
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {modalOpen && (

        <div
          className="
            fixed
            inset-0
            bg-black/60
            flex
            items-center
            justify-center
            z-50
          "
        >

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-6
              w-full
              max-w-lg
            "
          >

          <h2 className="text-2xl font-bold mb-6">
            {clienteSelecionado?.id
              ? "Editar Cliente"
              : "Novo Cliente"}
          </h2>

            <div className="space-y-4">

              <input
                type="text"
                value={clienteSelecionado?.name || ""}
                onChange={(e) =>
                  setClienteSelecionado({
                    ...clienteSelecionado,
                    name: e.target.value
                  })
                }
                className="
                  w-full
                  bg-slate-800
                  border
                  border-slate-700
                  rounded-xl
                  p-3
                "
              />

              <input
                type="text"
                value={clienteSelecionado?.phone || ""}
                onChange={(e) =>
                  setClienteSelecionado({
                    ...clienteSelecionado,
                    phone: e.target.value
                  })
                }
                className="
                  w-full
                  bg-slate-800
                  border
                  border-slate-700
                  rounded-xl
                  p-3
                "
              />

              <input
                type="email"
                value={clienteSelecionado?.email || ""}
                onChange={(e) =>
                  setClienteSelecionado({
                    ...clienteSelecionado,
                    email: e.target.value
                  })
                }
                className="
                  w-full
                  bg-slate-800
                  border
                  border-slate-700
                  rounded-xl
                  p-3
                "
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setModalOpen(false)}
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-slate-700
                  hover:bg-slate-600
                "
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-700
                "
              >
                {clienteSelecionado?.id
                  ? "Salvar Alterações"
                  : "Cadastrar Cliente"}
              </button>

            </div>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
}