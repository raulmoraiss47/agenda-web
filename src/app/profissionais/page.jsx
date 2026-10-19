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
  Trash2,
  Camera // 🔥 Ícone da câmera adicionado
} from "lucide-react";

export default function ProfissionaisPage() {
  const [profissionais, setProfissionais] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);

  // Novos estados para lidar com a foto
  const [fotoUpload, setFotoUpload] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    active: true
  });

  async function loadProfissionais() {
    try {
      const response = await api.get("/professionals");
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
    setFotoUpload(null);
    setFotoPreview(null);
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
    setFotoUpload(null);
    // Carrega a foto que já existe na base de dados
    setFotoPreview(profissional.photo_url || null);
    setModalOpen(true);
  }

  // Lidar com a seleção da imagem no computador do utilizador
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFotoUpload(file);
      setFotoPreview(URL.createObjectURL(file)); 
    }
  }

  async function handleSave() {
    try {
      // Usando FormData para suportar o envio de ficheiros
      const formData = new FormData();
      formData.append("name", form.name || "");
      formData.append("phone", form.phone || "");
      formData.append("email", form.email || "");
      
      // FormData não envia booleanos (true/false) nativamente, enviamos 1 ou 0
      formData.append("active", form.active ? 1 : 0);

      // Se selecionou uma nova foto, anexa ao envio
      if (fotoUpload) {
        formData.append("photo", fotoUpload);
      }

      if (profissionalSelecionado) {
        // Truque do Laravel para aceitar ficheiros no update
        formData.append("_method", "PUT");
        await api.post(`/professionals/${profissionalSelecionado.id}`, formData);
      } else {
        await api.post("/professionals", formData);
      }

      setModalOpen(false);
      loadProfissionais();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar profissional");
    }
  }

  async function handleDelete(id) {
    const confirmar = confirm("Deseja realmente excluir este profissional?");
    if (!confirmar) return;

    try {
      await api.delete(`/professionals/${id}`);
      loadProfissionais();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir profissional");
    }
  }

  const profissionaisFiltrados = profissionais.filter((profissional) =>
    profissional.name?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Profissionais</h1>
          <p className="opacity-70 mt-1">Gerencie sua equipe</p>
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
          Novo Profissional
        </button>
      </div>

      <div className="bg-custom-card border border-white/10 rounded-2xl p-4 mb-6 transition-colors">
        <div className="flex items-center gap-3">
          <Search size={18} className="opacity-50" />
          <input
            type="text"
            placeholder="Pesquisar profissional..."
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

      <div className="bg-custom-card border border-white/10 rounded-2xl overflow-hidden transition-colors">
        <table className="w-full border-collapse">
          <thead className="bg-custom-bg border-b border-white/10">
            <tr>
              <th className="text-left p-4 font-semibold">Profissional</th>
              <th className="text-left p-4 font-semibold">Telefone</th>
              <th className="text-left p-4 font-semibold">Email</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {profissionaisFiltrados.map((profissional) => (
              <tr
                key={profissional.id}
                className="
                  border-b
                  border-white/5
                  hover:bg-black/10
                  transition-colors
                "
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar atualizado para mostrar a foto */}
                    <div className="
                      w-10
                      h-10
                      rounded-full
                      bg-custom-primary
                      text-white
                      flex
                      items-center
                      justify-center
                      overflow-hidden
                    ">
                      {profissional.photo_url ? (
                        <img 
                          src={profissional.photo_url} 
                          alt={profissional.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <p className="font-medium">{profissional.name}</p>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2 opacity-80">
                    <Phone size={14} />
                    {profissional.phone || "-"}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2 opacity-80">
                    <Mail size={14} />
                    {profissional.email || "-"}
                  </div>
                </td>

                <td className="p-4">
                  {profissional.active ? (
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-xs font-medium">
                      Ativo
                    </span>
                  ) : (
                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg text-xs font-medium">
                      Inativo
                    </span>
                  )}
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(profissional)}
                      className="p-2 rounded-lg bg-custom-primary text-white hover:brightness-110 transition"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(profissional.id)}
                      className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-custom-card border border-white/10 rounded-2xl p-6 w-full max-w-lg text-custom-text shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {profissionalSelecionado ? "Editar Profissional" : "Novo Profissional"}
            </h2>

            {/* SEÇÃO DE UPLOAD DE FOTO */}
            <div className="flex justify-center mb-6">
              <label className="cursor-pointer group relative block rounded-full overflow-hidden w-24 h-24 border-2 border-custom-primary/30 hover:border-custom-primary transition-colors">
                {fotoPreview ? (
                  <img 
                    src={fotoPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-black/20 flex flex-col items-center justify-center text-white/50">
                    <User size={32} />
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
                type="text"
                placeholder="Nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-custom-text outline-none focus:border-custom-primary"
              />

              <input
                type="text"
                placeholder="Telefone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-custom-text outline-none focus:border-custom-primary"
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-custom-text outline-none focus:border-custom-primary"
              />

              <label className="flex gap-3 items-center cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-5 h-5 accent-custom-primary rounded bg-black/20 border-white/10"
                />
                <span className="opacity-90 font-medium">Profissional Ativo</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-black/30 hover:bg-black/50 transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-custom-primary text-white hover:brightness-110 transition"
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