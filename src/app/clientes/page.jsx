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
  Camera // Novo ícone importado
} from "lucide-react";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  
  // Novos estados para lidar com a foto
  const [fotoUpload, setFotoUpload] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  async function loadClientes() {
    try {
      const response = await api.get("/clients");
      setClientes(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
    const confirmar = confirm("Deseja realmente excluir este cliente?");
    if (!confirmar) return;

    try {
      await api.delete(`/clients/${id}`);
      loadClientes();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir cliente");
    }
  }

  // Função atualizada para lidar com o envio de ficheiros usando FormData
  async function handleSave() {
    try {
      const formData = new FormData();
      formData.append("name", clienteSelecionado.name || "");
      formData.append("phone", clienteSelecionado.phone || "");
      formData.append("email", clienteSelecionado.email || "");

      // Se uma nova foto foi selecionada, adiciona-a ao FormData
      if (fotoUpload) {
        formData.append("photo", fotoUpload);
      }

      if (clienteSelecionado.id) {
        // Truque do Laravel: Para atualizar (PUT) com ficheiros, enviamos como POST com _method=PUT
        formData.append("_method", "PUT");
        await api.post(`/clients/${clienteSelecionado.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/clients", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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
    setFotoUpload(null);
    // Se o cliente já tiver uma foto vinda da base de dados, mostra no preview
    setFotoPreview(cliente.photo_url || null);
    setModalOpen(true);
  }

  function handleOpenNew() {
    setClienteSelecionado({
      name: "",
      phone: "",
      email: ""
    });
    setFotoUpload(null);
    setFotoPreview(null);
    setModalOpen(true);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFotoUpload(file);
      // Cria um link temporário para mostrar a foto no ecrã imediatamente
      setFotoPreview(URL.createObjectURL(file)); 
    }
  }

  useEffect(() => {
    loadClientes();
  }, []);

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.name?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* TOPO */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="opacity-70 mt-1">Gerencie sua base de clientes</p>
        </div>

        <button
          onClick={handleOpenNew}
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
          Novo Cliente
        </button>
      </div>

      {/* PESQUISA */}
      <div className="bg-custom-card border border-white/10 rounded-2xl p-4 mb-6 transition-colors">
        <div className="flex items-center gap-3">
          <Search size={18} className="opacity-50" />
          <input
            type="text"
            placeholder="Pesquisar cliente..."
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

      {/* TABELA */}
      <div className="bg-custom-card border border-white/10 rounded-2xl overflow-hidden transition-colors">
        <table className="w-full border-collapse">
          <thead className="bg-custom-bg border-b border-white/10">
            <tr>
              <th className="text-left p-4 font-semibold">Cliente</th>
              <th className="text-left p-4 font-semibold">Telefone</th>
              <th className="text-left p-4 font-semibold">Email</th>
              <th className="text-left p-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr
                key={cliente.id}
                className="
                  border-b
                  border-white/5
                  hover:bg-black/10
                  transition-colors
                "
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar do utilizador ajustado para renderizar foto */}
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
                      {cliente.photo_url ? (
                        <img 
                          src={cliente.photo_url} 
                          alt={cliente.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{cliente.name}</p>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2 opacity-80">
                    <Phone size={14} />
                    {cliente.phone}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2 opacity-80">
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
                        bg-custom-primary
                        text-white
                        hover:brightness-110
                        transition
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
                        text-white
                        hover:bg-red-700
                        transition
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

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-custom-card border border-white/10 rounded-2xl p-6 w-full max-w-lg text-custom-text shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {clienteSelecionado?.id ? "Editar Cliente" : "Novo Cliente"}
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
                
                {/* Overlay que aparece no hover */}
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                  <Camera size={24} className="text-white" />
                </div>
                
                {/* Input escondido */}
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
                placeholder="Nome completo"
                value={clienteSelecionado?.name || ""}
                onChange={(e) =>
                  setClienteSelecionado({
                    ...clienteSelecionado,
                    name: e.target.value
                  })
                }
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-custom-text outline-none focus:border-custom-primary"
              />

              <input
                type="text"
                placeholder="Telefone"
                value={clienteSelecionado?.phone || ""}
                onChange={(e) =>
                  setClienteSelecionado({
                    ...clienteSelecionado,
                    phone: e.target.value
                  })
                }
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-custom-text outline-none focus:border-custom-primary"
              />

              <input
                type="email"
                placeholder="E-mail"
                value={clienteSelecionado?.email || ""}
                onChange={(e) =>
                  setClienteSelecionado({
                    ...clienteSelecionado,
                    email: e.target.value
                  })
                }
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-custom-text outline-none focus:border-custom-primary"
              />
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
                {clienteSelecionado?.id ? "Salvar Alterações" : "Cadastrar Cliente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}