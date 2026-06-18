"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Clock3,
  DollarSign,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function ServicosPage() {

  const [services, setServices] = useState([]);
  const [busca, setBusca] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [serviceSelecionado, setServiceSelecionado] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    duration_minutes: 30,
    price: "",
    active: true
  });

  async function loadServices() {

    try {

      const response =
        await api.get("/services");

      setServices(response.data);

    } catch (error) {

      console.error(error);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  function handleNovo() {

    setServiceSelecionado(null);

    setForm({
      name: "",
      description: "",
      duration_minutes: 30,
      price: "",
      active: true
    });

    setModalOpen(true);
  }

  function handleEdit(service) {

    setServiceSelecionado(service);

    setForm({
      name: service.name,
      description: service.description || "",
      duration_minutes: service.duration_minutes,
      price: service.price,
      active: service.active
    });

    setModalOpen(true);
  }

  async function handleSave() {

    try {

      if (serviceSelecionado) {

        await api.put(
          `/services/${serviceSelecionado.id}`,
          form
        );

      } else {

        await api.post(
          "/services",
          form
        );
      }

      setModalOpen(false);

      loadServices();

    } catch (error) {

      console.error(error);

      alert("Erro ao salvar serviço");
    }
  }

  async function handleDelete(id) {

    if (
      !confirm(
        "Deseja realmente excluir este serviço?"
      )
    ) {
      return;
    }

    try {

      await api.delete(
        `/services/${id}`
      );

      loadServices();

    } catch (error) {

      console.error(error);

      alert("Erro ao excluir serviço");
    }
  }

  const servicesFiltrados =
    services.filter((service) =>
      service.name
        ?.toLowerCase()
        .includes(busca.toLowerCase())
    );

  return (
    <DashboardLayout>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Serviços
          </h1>

          <p className="text-slate-400 mt-1">
            Gerencie os serviços oferecidos
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
            transition
          "
        >
          <Plus size={18} />
          Novo Serviço
        </button>

      </div>

      {/* BUSCA */}

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-4
          mb-8
        "
      >

        <div className="flex items-center gap-3">

          <Search size={18} />

          <input
            type="text"
            placeholder="Pesquisar serviço..."
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

      {/* CARDS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
      >

        {servicesFiltrados.map((service) => (

          <div
            key={service.id}
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-3xl
              p-6
              hover:border-blue-500/50
              hover:scale-[1.02]
              transition
              shadow-xl
            "
          >

            <div className="flex justify-between items-start mb-4">

              <div>

                <h3 className="text-xl font-bold">
                  {service.name}
                </h3>

                <p className="text-slate-400 text-sm mt-1">
                  {service.description || "Sem descrição"}
                </p>

              </div>

              {service.active ? (

                <span
                  className="
                    bg-green-500/20
                    text-green-400
                    px-3
                    py-1
                    rounded-xl
                    text-xs
                    flex
                    items-center
                    gap-1
                  "
                >
                  <CheckCircle size={12} />
                  Ativo
                </span>

              ) : (

                <span
                  className="
                    bg-red-500/20
                    text-red-400
                    px-3
                    py-1
                    rounded-xl
                    text-xs
                    flex
                    items-center
                    gap-1
                  "
                >
                  <XCircle size={12} />
                  Inativo
                </span>

              )}

            </div>

            <div className="space-y-3">

              <div className="flex items-center gap-2 text-slate-300">

                <Clock3 size={16} />

                <span>
                  {service.duration_minutes} min
                </span>

              </div>

              <div className="flex items-center gap-2 text-emerald-400 font-semibold">

                <DollarSign size={16} />

                <span>
                  R$ {Number(service.price).toFixed(2)}
                </span>

              </div>

            </div>

            <div className="flex gap-3 mt-6">

              <button
                onClick={() =>
                  handleEdit(service)
                }
                className="
                  flex-1
                  bg-blue-600
                  hover:bg-blue-700
                  py-2
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <Pencil size={16} />
                Editar
              </button>

              <button
                onClick={() =>
                  handleDelete(service.id)
                }
                className="
                  bg-red-600
                  hover:bg-red-700
                  px-4
                  rounded-xl
                "
              >
                <Trash2 size={16} />
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* MODAL */}

      {modalOpen && (

        <div
          className="
            fixed
            inset-0
            bg-black/70
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
              rounded-3xl
              p-8
              w-full
              max-w-xl
            "
          >

            <h2 className="text-2xl font-bold mb-6">

              {serviceSelecionado
                ? "Editar Serviço"
                : "Novo Serviço"}

            </h2>

            <div className="space-y-4">

              <input
                placeholder="Nome do serviço"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                className="
                  w-full
                  p-3
                  rounded-xl
                  bg-slate-800
                  border
                  border-slate-700
                "
              />

              <textarea
                rows="3"
                placeholder="Descrição"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value
                  })
                }
                className="
                  w-full
                  p-3
                  rounded-xl
                  bg-slate-800
                  border
                  border-slate-700
                "
              />

              <input
                type="number"
                placeholder="Duração em minutos"
                value={form.duration_minutes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    duration_minutes: e.target.value
                  })
                }
                className="
                  w-full
                  p-3
                  rounded-xl
                  bg-slate-800
                  border
                  border-slate-700
                "
              />

              <input
                type="number"
                step="0.01"
                placeholder="Preço"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value
                  })
                }
                className="
                  w-full
                  p-3
                  rounded-xl
                  bg-slate-800
                  border
                  border-slate-700
                "
              />

              <label className="flex items-center gap-3">

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

                Serviço ativo

              </label>

            </div>

            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() =>
                  setModalOpen(false)
                }
                className="
                  px-5
                  py-3
                  rounded-xl
                  bg-slate-700
                "
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                className="
                  px-5
                  py-3
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