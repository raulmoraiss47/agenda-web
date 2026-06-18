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

export default function ProfissionaisPage() {

  const [profissionais, setProfissionais] = useState([]);
  const [busca, setBusca] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [profissionalSelecionado, setProfissionalSelecionado] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    active: true
  });

  async function loadProfissionais() {

    try {

      const response =
        await api.get("/professionals");

      setProfissionais(response.data);

    } catch (error) {

      console.error(error);
    }
  }

  useEffect(() => {
    loadProfissionais();
  }, []);

  function handleNovo() {

    setProfissionalSelecionado(null);

    setForm({
      name: "",
      phone: "",
      email: "",
      active: true
    });

    setModalOpen(true);
  }

  function handleEdit(profissional) {

    setProfissionalSelecionado(profissional);

    setForm({
      name: profissional.name || "",
      phone: profissional.phone || "",
      email: profissional.email || "",
      active: profissional.active
    });

    setModalOpen(true);
  }

  async function handleSave() {

    try {

      if (profissionalSelecionado) {

        await api.put(
          `/professionals/${profissionalSelecionado.id}`,
          form
        );

      } else {

        await api.post(
          "/professionals",
          form
        );
      }

      setModalOpen(false);

      loadProfissionais();

    } catch (error) {

      console.error(error);

      alert("Erro ao salvar profissional");
    }
  }

  async function handleDelete(id) {

    const confirmar = confirm(
      "Deseja realmente excluir este profissional?"
    );

    if (!confirmar) return;

    try {

      await api.delete(
        `/professionals/${id}`
      );

      loadProfissionais();

    } catch (error) {

      console.error(error);

      alert("Erro ao excluir profissional");
    }
  }

  const profissionaisFiltrados =
    profissionais.filter((profissional) =>
      profissional.name
        ?.toLowerCase()
        .includes(busca.toLowerCase())
    );

  return (
    <DashboardLayout>

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Profissionais
          </h1>

          <p className="text-slate-400 mt-1">
            Gerencie sua equipe
          </p>
        </div>

        <button
          onClick={handleNovo}
          className="
            bg-blue-600
            hover:bg-blue-700
            px-5
            py-3
            rounded-xl
            flex
            items-center
            gap-2
          "
        >
          <Plus size={18} />
          Novo Profissional
        </button>

      </div>

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
            placeholder="Pesquisar profissional..."
            value={busca}
            onChange={(e) =>
              setBusca(e.target.value)
            }
            className="
              flex-1
              bg-transparent
              outline-none
            "
          />

        </div>
      </div>

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
                Profissional
              </th>

              <th className="text-left p-4">
                Telefone
              </th>

              <th className="text-left p-4">
                Email
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Ações
              </th>

            </tr>

          </thead>

          <tbody>

            {profissionaisFiltrados.map((profissional) => (

              <tr
                key={profissional.id}
                className="
                  border-t
                  border-slate-800
                  hover:bg-slate-800/50
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

                    <p className="font-medium">
                      {profissional.name}
                    </p>

                  </div>

                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <Phone size={14} />
                    {profissional.phone || "-"}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <Mail size={14} />
                    {profissional.email || "-"}
                  </div>
                </td>

                <td className="p-4">

                  {profissional.active ? (

                    <span className="
                      bg-green-500/20
                      text-green-400
                      px-3
                      py-1
                      rounded-lg
                      text-xs
                    ">
                      Ativo
                    </span>

                  ) : (

                    <span className="
                      bg-red-500/20
                      text-red-400
                      px-3
                      py-1
                      rounded-lg
                      text-xs
                    ">
                      Inativo
                    </span>

                  )}

                </td>

                <td className="p-4">

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        handleEdit(profissional)
                      }
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
                      onClick={() =>
                        handleDelete(profissional.id)
                      }
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

        <div className="
          fixed
          inset-0
          bg-black/60
          flex
          items-center
          justify-center
          z-50
        ">

          <div className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-6
            w-full
            max-w-lg
          ">

            <h2 className="text-2xl font-bold mb-6">

              {profissionalSelecionado
                ? "Editar Profissional"
                : "Novo Profissional"}

            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Nome"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
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
                placeholder="Telefone"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
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
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
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

              <label className="flex gap-3 items-center">

                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      active: e.target.checked
                    })
                  }
                />

                Profissional Ativo

              </label>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() =>
                  setModalOpen(false)
                }
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-slate-700
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
                Salvar
              </button>

            </div>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
}