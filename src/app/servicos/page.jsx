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
  XCircle,
  Camera,
  Image as ImageIcon // Ícone para quando o serviço não tiver foto
} from "lucide-react";

export default function ServicosPage() {
  const [services, setServices] = useState([]);
  const [busca, setBusca] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [serviceSelecionado, setServiceSelecionado] = useState(null);

  // Estados para a foto do Serviço
  const [fotoUpload, setFotoUpload] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    duration_minutes: 30,
    price: "",
    active: true
  });

  async function loadServices() {
    try {
      const response = await api.get("/services");
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
    setFotoUpload(null);
    setFotoPreview(null);
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
    setFotoUpload(null);
    setFotoPreview(service.photo_url || null);
    setModalOpen(true);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFotoUpload(file);
      setFotoPreview(URL.createObjectURL(file)); 
    }
  }

  async function handleSave() {
    try {
      const formData = new FormData();
      formData.append("name", form.name || "");
      formData.append("description", form.description || "");
      formData.append("duration_minutes", form.duration_minutes || 30);
      formData.append("price", form.price || "");
      formData.append("active", form.active ? 1 : 0);

      if (fotoUpload) {
        formData.append("photo", fotoUpload);
      }

      if (serviceSelecionado) {
        formData.append("_method", "PUT");
        await api.post(`/services/${serviceSelecionado.id}`, formData);
      } else {
        await api.post("/services", formData);
      }

      setModalOpen(false);
      loadServices();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar serviço");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Deseja realmente excluir este serviço?")) {
      return;
    }

    try {
      await api.delete(`/services/${id}`);
      loadServices();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir serviço");
    }
  }

  const servicesFiltrados = services.filter((service) =>
    service.name?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Serviços</h1>
          <p className="opacity-70 mt-1">Gerencie os serviços oferecidos</p>
        </div>

        <button
          onClick={handleNovo}
          className="
            bg-custom-primary
            hover:brightness-110
            text-white
            px-5
            py-3
            rounded-xl
            flex
            items-center
            gap-2
            transition-all
          "
        >
          <Plus size={18} />
          Novo Serviço
        </button>
      </div>

      {/* BUSCA */}
      <div className="bg-custom-card border border-white/10 rounded-2xl p-4 mb-8 transition-colors">
        <div className="flex items-center gap-3">
          <Search size={18} className="opacity-50" />
          <input
            type="text"
            placeholder="Pesquisar serviço..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="
              flex-1
              bg-transparent
              outline-none
              text-custom-text
              placeholder:opacity-50
            "
          />
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {servicesFiltrados.map((service) => (
          <div
            key={service.id}
            className="
              bg-custom-card
              border
              border-white/10
              rounded-3xl
              p-6
              hover:border-custom-primary/50
              hover:scale-[1.02]
              transition-all
              shadow-xl
            "
          >
            <div className="flex justify-between items-start mb-4 gap-4">
              <div className="flex gap-4 items-start">
                {/* Thumbnail do Serviço */}
                <div className="w-16 h-16 rounded-xl bg-custom-primary/20 text-custom-primary flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {service.photo_url ? (
                    <img 
                      src={service.photo_url} 
                      alt={service.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={28} />
                  )}
                </div>
                
                <div>
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  <p className="opacity-70 text-sm mt-1 line-clamp-2">
                    {service.description || "Sem descrição"}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex-shrink-0">
                {service.active ? (
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-xl text-xs flex items-center gap-1 font-medium">
                    <CheckCircle size={12} />
                    Ativo
                  </span>
                ) : (
                  <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-xl text-xs flex items-center gap-1 font-medium">
                    <XCircle size={12} />
                    Inativo
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 opacity-80">
                <Clock3 size={16} />
                <span>{service.duration_minutes} min</span>
              </div>

              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <DollarSign size={16} />
                <span>R$ {Number(service.price).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleEdit(service)}
                className="
                  flex-1
                  bg-custom-primary
                  hover:brightness-110
                  text-white
                  py-2
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition
                "
              >
                <Pencil size={16} />
                Editar
              </button>

              <button
                onClick={() => handleDelete(service.id)}
                className="
                  bg-red-600
                  hover:bg-red-700
                  text-white
                  px-4
                  rounded-xl
                  transition
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-custom-card border border-white/10 rounded-3xl p-8 w-full max-w-xl text-custom-text shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {serviceSelecionado ? "Editar Serviço" : "Novo Serviço"}
            </h2>

            {/* SEÇÃO DE UPLOAD DE FOTO (Estilo Quadrado Arredondado) */}
            <div className="flex justify-center mb-6">
              <label className="cursor-pointer group relative block rounded-2xl overflow-hidden w-32 h-32 border-2 border-custom-primary/30 hover:border-custom-primary transition-colors">
                {fotoPreview ? (
                  <img 
                    src={fotoPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-black/20 flex flex-col items-center justify-center text-white/50">
                    <ImageIcon size={32} />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                  <Camera size={24} className="text-white" />
                </div>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Nome do serviço"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-custom-text outline-none focus:border-custom-primary"
              />

              <textarea
                rows="3"
                placeholder="Descrição"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-custom-text outline-none focus:border-custom-primary"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Duração (min)"
                  value={form.duration_minutes}
                  onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                  className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-custom-text outline-none focus:border-custom-primary"
                />

                <input
                  type="number"
                  step="0.01"
                  placeholder="Preço (R$)"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-custom-text outline-none focus:border-custom-primary"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-5 h-5 accent-custom-primary rounded bg-black/20 border-white/10"
                />
                <span className="opacity-90 font-medium">Serviço ativo</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-3 rounded-xl bg-black/30 hover:bg-black/50 transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                className="px-5 py-3 rounded-xl bg-custom-primary hover:brightness-110 text-white transition font-medium"
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