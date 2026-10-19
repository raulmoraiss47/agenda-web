"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";
import { MessageSquare, RefreshCw, CheckCircle2, XCircle, QrCode, Settings, Save } from "lucide-react";

export default function WhatsAppPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connecting, setConnecting] = useState(false);
  
  const [formData, setFormData] = useState({
    evolution_url: "",
    evolution_apikey: "",
    whatsapp_instance: "",
  });

  const [statusInfo, setStatusInfo] = useState({
    status: "disconnected",
    phone: null,
    configured: false,
  });

  const [qrCode, setQrCode] = useState(null);

  // Carrega o status atual da empresa
async function loadStatus() {
    try {
      const response = await api.get("/whatsapp/status");
      
      // Só atualiza o estado se houver mudanças para evitar re-renderizações desnecessárias
      setStatusInfo(prevStatus => {
        // Se mudou de desconectado para conectado, limpamos o QR Code
        if (prevStatus.status !== "connected" && response.data.status === "connected") {
          setQrCode(null);
        }
        return response.data;
      });

      if (response.data.configured && !formData.evolution_url) {
        setFormData({
          evolution_url: response.data.evolution_url || "",
          evolution_apikey: response.data.evolution_apikey || "",
          whatsapp_instance: response.data.whatsapp_instance || "",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar status do WhatsApp", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();

    // Cria um loop que verifica o estado a cada 3 segundos (3000 milissegundos)
    const interval = setInterval(() => {
      loadStatus();
    }, 3000);

    // Limpa o loop quando o utilizador sair desta página para não consumir memória
    return () => clearInterval(interval);
  
  }, []);

  // Salvar configurações
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/whatsapp/configure", formData);
      alert("Configurações guardadas com sucesso!");
      loadStatus();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Erro ao guardar configurações.");
    } finally {
      setSaving(false);
    }
  }

  // Obter QR Code
  async function handleGetQrCode() {
    setConnecting(true);
    setQrCode(null);
    try {
      const response = await api.get("/whatsapp/connect");
      if (response.data.base64) {
        setQrCode(response.data.base64);
      } else {
        alert("Instância já conectada ou QR Code indisponível no momento.");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Erro ao obter QR Code.");
    } finally {
      setConnecting(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="opacity-70 animate-pulse text-lg">A carregar integração do WhatsApp...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-8">
        
        {/* CABEÇALHO */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MessageSquare className="text-custom-primary" size={28} />
            Integração WhatsApp
          </h1>
          <p className="opacity-70 mt-1">Conecte o seu WhatsApp para automatizar os lembretes e confirmações de agendamento.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLUNA DA ESQUERDA: CONFIGURAÇÃO */}
          <div className="md:col-span-2 bg-custom-card border border-white/10 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Settings size={20} className="text-custom-primary" />
              Parâmetros da Instância
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium opacity-80 mb-1">URL da Evolution API</label>
                <input
                  type="url"
                  placeholder="https://api.sualoja.com"
                  value={formData.evolution_url}
                  onChange={(e) => setFormData({ ...formData, evolution_url: e.target.value })}
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-custom-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium opacity-80 mb-1">Global API Key</label>
                <input
                  type="password"
                  placeholder="Sua chave secreta da API"
                  value={formData.evolution_apikey}
                  onChange={(e) => setFormData({ ...formData, evolution_apikey: e.target.value })}
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-custom-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium opacity-80 mb-1">Nome da Instância</label>
                <input
                  type="text"
                  placeholder="ex: barbearia-central"
                  value={formData.whatsapp_instance}
                  onChange={(e) => setFormData({ ...formData, whatsapp_instance: e.target.value })}
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-custom-primary"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-custom-primary hover:brightness-110 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm mt-4"
              >
                <Save size={18} />
                {saving ? "A guardar..." : "Guardar Configurações"}
              </button>
            </form>
          </div>

          {/* COLUNA DA DIREITA: STATUS E QR CODE */}
          <div className="bg-custom-card border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between text-center">
            
            <div className="w-full">
              <h2 className="text-xl font-bold mb-4">Estado da Conexão</h2>

              {/* Status Badge */}
              <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-6 flex flex-col items-center justify-center">
                {statusInfo.status === "connected" ? (
                  <>
                    <CheckCircle2 className="text-emerald-400 mb-2" size={36} />
                    <span className="text-emerald-400 font-bold text-sm">Conectado</span>
                    {statusInfo.phone && <span className="text-xs opacity-70 mt-1">{statusInfo.phone}</span>}
                  </>
                ) : (
                  <>
                    <XCircle className="text-rose-400 mb-2" size={36} />
                    <span className="text-rose-400 font-bold text-sm">Desconectado</span>
                  </>
                )}
              </div>
            </div>

            {/* ÁREA DO QR CODE */}
            <div className="w-full flex flex-col items-center justify-center my-auto">
              {qrCode ? (
                <div className="bg-white p-3 rounded-2xl shadow-md mb-4">
                  <img src={qrCode} alt="WhatsApp QR Code" className="w-48 h-48 object-contain" />
                </div>
              ) : (
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 w-full flex flex-col items-center justify-center mb-4 opacity-60">
                  <QrCode size={40} className="mb-2" />
                  <p className="text-xs">Clique abaixo para gerar o QR Code de pareamento</p>
                </div>
              )}

              <button
                onClick={handleGetQrCode}
                disabled={connecting || !statusInfo.configured}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              >
                <RefreshCw size={16} className={connecting ? "animate-spin" : ""} />
                {connecting ? "A gerar..." : "Gerar QR Code"}
              </button>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}