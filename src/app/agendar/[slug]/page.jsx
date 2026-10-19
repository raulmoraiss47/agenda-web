"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/services/api";
import { CheckCircle, Calendar, Clock, User, Phone, Briefcase, Sparkles, ShieldCheck, AlertCircle } from "lucide-react";

export default function PublicBookingPage() {
  const params = useParams();
  const slug = params?.slug;

  const [company, setCompany] = useState(null);
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [form, setForm] = useState({
    client_name: "",
    client_phone: "",
    service_id: "",
    professional_id: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    if (!slug) return;

    async function loadPublicData() {
      try {
        const response = await api.get(`/public/company/${slug}`);
        const data = response.data;
        
        setCompany(data.company);
        setServices(data.services);
        setProfessionals(data.professionals);

        const theme = data.company?.settings?.theme;
        if (theme) {
          const root = document.documentElement;
          root.style.setProperty('--color-primary', theme.primary_color || '#2563eb');
          root.style.setProperty('--color-bg', theme.bg_color || '#0f172a');
          root.style.setProperty('--color-card', theme.card_color || '#1e293b');
          root.style.setProperty('--color-text', theme.text_color || '#f8fafc');
        }
      } catch (err) {
        console.error("Erro ao carregar dados da empresa:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPublicData();
  }, [slug]);

  // Busca horários quando o utilizador escolhe Profissional + Serviço + Data
  useEffect(() => {
    async function fetchSlots() {
      if (!form.date || !form.professional_id || !form.service_id || !slug) {
        setAvailableSlots([]);
        return;
      }

      setLoadingSlots(true);
      setForm(prev => ({ ...prev, time: "" })); // Reseta a hora escolhida

      try {
        const response = await api.get(`/public/available-slots/${slug}`, {
          params: {
            date: form.date,
            professional_id: form.professional_id,
            service_id: form.service_id
          }
        });
        setAvailableSlots(response.data.slots);
      } catch (error) {
        console.error("Erro ao buscar horários", error);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchSlots();
  }, [form.date, form.professional_id, form.service_id, slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!form.time) {
        setErrorMsg("Por favor, selecione um horário disponível.");
        return;
    }

    try {
      const startDateTime = `${form.date} ${form.time}:00`;
      
      await api.post(`/public/appointments/${slug}`, {
        client_name: form.client_name,
        client_phone: form.client_phone,
        service_id: form.service_id,
        professional_id: form.professional_id,
        start_datetime: startDateTime,
      });

      setSuccess(true);
    } catch (error) {
      console.error(error);
      setErrorMsg(error?.response?.data?.message || "Ocorreu um erro ao realizar o agendamento. Tente novamente.");
    }
  }

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errorMsg) setErrorMsg("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-custom-bg text-custom-text flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-custom-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="animate-pulse font-medium text-sm opacity-80">A preparar a agenda...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-custom-bg text-custom-text flex items-center justify-center p-4 text-center">
        <div className="bg-custom-card border border-white/10 p-8 rounded-2xl max-w-md shadow-2xl">
          <h2 className="text-xl font-bold mb-2">Estabelecimento não encontrado</h2>
          <p className="opacity-70 text-sm">O link pode estar incorreto ou a empresa encontra-se temporariamente inativa.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-custom-bg text-custom-text flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500">
      <div className="w-full max-w-4xl grid lg:grid-cols-12 gap-8 items-center">
        
        {/* COLUNA ESQUERDA */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-custom-primary/10 text-custom-primary text-xs font-semibold tracking-wide uppercase border border-custom-primary/20">
            <Sparkles size={14} /> Agendamento Online
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-custom-primary text-white flex items-center justify-center text-3xl font-extrabold shadow-xl ring-4 ring-custom-primary/20 overflow-hidden">
              {company.logo_url ? (
                <img 
                  src={company.logo_url} 
                  alt={company.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{company.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">{company.name}</h1>
              <p className="opacity-70 text-sm mt-1">Marque o seu horário de forma rápida e segura.</p>
            </div>
          </div>

          <div className="hidden lg:block pt-6 border-t border-white/10 space-y-3 opacity-80 text-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-custom-primary" size={18} />
              <span>Confirmação imediata na agenda do profissional.</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-custom-primary" size={18} />
              <span>Escolha o melhor horário conforme a sua disponibilidade.</span>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="lg:col-span-7">
          <div className="bg-custom-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-custom-primary/10 rounded-full blur-3xl pointer-events-none" />

            {success ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-500/10">
                  <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold">Tudo Pronto!</h2>
                <p className="opacity-70 text-sm max-w-xs mx-auto">
                  O seu agendamento foi registado com sucesso. Obrigado pela preferência!
                </p>
                <button
                  onClick={() => { 
                    setSuccess(false); 
                    setForm({ client_name: "", client_phone: "", service_id: "", professional_id: "", date: "", time: "" }); 
                  }}
                  className="mt-6 px-6 py-3 bg-custom-primary text-white rounded-xl font-medium hover:brightness-110 transition shadow-lg w-full"
                >
                  Fazer outro agendamento
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-2">
                  <h2 className="text-xl font-bold">Novo Agendamento</h2>
                  <p className="opacity-60 text-xs mt-0.5">Preencha os campos abaixo para garantir a sua vaga.</p>
                </div>

                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <p className="text-sm font-medium leading-relaxed">{errorMsg}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">O seu Nome</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-3.5 opacity-40" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Maria Oliveira"
                        value={form.client_name}
                        onChange={(e) => handleInputChange("client_name", e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-custom-text outline-none focus:border-custom-primary focus:ring-1 focus:ring-custom-primary transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Telemóvel / WhatsApp</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3.5 top-3.5 opacity-40" />
                      <input
                        type="text"
                        required
                        placeholder="(00) 00000-0000"
                        value={form.client_phone}
                        onChange={(e) => handleInputChange("client_phone", e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-custom-text outline-none focus:border-custom-primary focus:ring-1 focus:ring-custom-primary transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Serviço</label>
                      <div className="relative">
                        <Briefcase size={18} className="absolute left-3.5 top-3.5 opacity-40 pointer-events-none" />
                        <select
                          required
                          value={form.service_id}
                          onChange={(e) => handleInputChange("service_id", e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-custom-text outline-none focus:border-custom-primary focus:ring-1 focus:ring-custom-primary transition-all text-sm appearance-auto cursor-pointer"
                        >
                          <option value="" className="bg-slate-900 text-white">Selecione...</option>
                          {services.map((s) => (
                            <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                              {s.name} (R$ {s.price})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Profissional</label>
                      <div className="relative">
                        <User size={18} className="absolute left-3.5 top-3.5 opacity-40 pointer-events-none" />
                        <select
                          required
                          value={form.professional_id}
                          onChange={(e) => handleInputChange("professional_id", e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-custom-text outline-none focus:border-custom-primary focus:ring-1 focus:ring-custom-primary transition-all text-sm appearance-auto cursor-pointer"
                        >
                          <option value="" className="bg-slate-900 text-white">Selecione...</option>
                          {professionals.map((p) => (
                            <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* DATA */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Data</label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3.5 top-3.5 opacity-40 pointer-events-none" />
                      <input
                        type="date"
                        required
                        value={form.date}
                        min={new Date().toISOString().split('T')[0]} // Impede datas passadas (opcional)
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-custom-text outline-none focus:border-custom-primary focus:ring-1 focus:ring-custom-primary transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* HORÁRIOS DISPONÍVEIS */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-2">Horários Disponíveis</label>
                    
                    {loadingSlots ? (
                      <div className="text-sm opacity-60 flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-custom-primary border-t-transparent rounded-full animate-spin"></div>
                        A procurar horários...
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleInputChange("time", slot)}
                            className={`py-2 rounded-lg text-sm font-medium transition-all ${
                              form.time === slot
                                ? "bg-custom-primary text-white shadow-md shadow-custom-primary/30"
                                : "bg-black/20 border border-white/10 text-custom-text hover:border-custom-primary hover:bg-custom-primary/10"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : form.date && form.professional_id && form.service_id ? (
                      <div className="text-sm text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                        Nenhum horário disponível para este dia.
                      </div>
                    ) : (
                      <div className="text-sm opacity-50 bg-black/10 p-3 rounded-xl border border-white/5">
                        Preencha o serviço, profissional e data primeiro.
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3.5 bg-custom-primary text-white rounded-xl font-bold hover:brightness-110 transition shadow-xl shadow-custom-primary/20 tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!form.time}
                >
                  Confirmar Agendamento
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </main>
  );
}