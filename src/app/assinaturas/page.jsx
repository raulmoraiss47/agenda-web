"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";
import { 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Download, 
  Check, 
  AlertCircle,
  Settings
} from "lucide-react";

export default function AssinaturasPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  
  const [subInfo, setSubInfo] = useState({
    subscribed: false,
    planType: "inactive",
    daysRemaining: 0,
    endDate: null,
    stripeStatus: "inactive",
    invoices: [],
  });

  async function loadSubscriptionStatus() {
    try {
      const response = await api.get("/subscription/status");
      setSubInfo(response.data);
    } catch (error) {
      console.error("Erro ao carregar status da assinatura", error);
    } finally {
      setFetching(false);
    }
  }

useEffect(() => {
  loadSubscriptionStatus();
  
  // Se voltou do checkout com sucesso na URL, revalida o status
  const params = new URLSearchParams(window.location.search);
  if (params.get("success")) {
    loadSubscriptionStatus();
  }
}, []);

  // FUNÇÃO DE ASSINATURA (Gera o link de pagamento do Stripe)
  async function handleAssinar() {
    setLoading(true);
    try {
      const response = await api.post("/subscription/checkout");
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Erro ao gerar pagamento. Tente novamente.");
      setLoading(false);
    }
  }

  // FUNÇÃO DO PORTAL (Para o cliente trocar o cartão ou cancelar o plano)
  async function handleManageSubscription() {
    setPortalLoading(true);
    try {
      const response = await api.post("/subscription/portal");
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Erro ao carregar o portal:", error);
      alert("Erro ao aceder ao portal de gestão. Tente novamente.");
      setPortalLoading(false);
    }
  }

  if (fetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="opacity-70 animate-pulse text-lg">A carregar detalhes da assinatura...</p>
        </div>
      </DashboardLayout>
    );
  }

  const diasRestantesFormatados = Math.round(subInfo.daysRemaining);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="text-custom-primary" size={26} />
            Assinatura e Faturamento
          </h1>
          <p className="opacity-70 mt-1">Gerencie seu plano, faturas e métodos de pagamento</p>
        </div>
      </div>

      {subInfo.subscribed ? (
        /* =========================================================================
           TELA 1: CLIENTE JÁ ASSINOU (MOSTRA O PAINEL E OS DIAS RESTANTES)
           ========================================================================= */
        <div className="space-y-6">
          <div className="bg-custom-card border border-custom-primary/40 shadow-[0_0_20px_rgba(var(--color-primary),0.15)] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-custom-primary/10 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
              <div>
                <span className="text-xs uppercase tracking-wider text-custom-primary font-bold">Plano Atual</span>
                <h2 className="text-2xl font-bold mt-0.5">Plano Profissional</h2>
                <p className="text-emerald-400 font-semibold mt-0.5 text-sm">R$ 49,99 / mês</p>
              </div>

              <div className="flex items-center gap-3 bg-black/40 px-5 py-3 rounded-xl border border-white/10">
                {subInfo.planType === 'trial' && (
                  <>
                    <Clock className="text-amber-400" size={24} />
                    <div>
                      <p className="text-[10px] opacity-70 uppercase tracking-wider">Estado</p>
                      <p className="text-amber-400 font-bold text-sm">Em Teste ({diasRestantesFormatados} dias restantes)</p>
                    </div>
                  </>
                )}

                {subInfo.planType === 'paid' && (
                  <>
                    <CheckCircle2 className="text-emerald-400" size={24} />
                    <div>
                      <p className="text-[10px] opacity-70 uppercase tracking-wider">Estado</p>
                      <p className="text-emerald-400 font-bold text-sm">Ativo (Renova em {diasRestantesFormatados} dias)</p>
                    </div>
                  </>
                )}

                {subInfo.planType === 'canceled' && (
                  <>
                    <AlertCircle className="text-red-400" size={24} />
                    <div>
                      <p className="text-[10px] opacity-70 uppercase tracking-wider">Estado</p>
                      <p className="text-red-400 font-bold text-sm">Cancelado (Acesso até {subInfo.endDate})</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {(subInfo.planType === 'trial' || subInfo.planType === 'canceled') && subInfo.endDate && (
              <div className="mt-5 bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center gap-3 relative z-10">
                <AlertCircle className="text-amber-400 flex-shrink-0" size={20} />
                <p className="text-sm font-medium">
                  O seu acesso ao plano termina no dia <strong className="text-amber-400">{subInfo.endDate}</strong>.
                </p>
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-white/10 flex justify-end relative z-10">
              <button
                onClick={handleManageSubscription}
                disabled={portalLoading}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
              >
                <Settings size={16} className={portalLoading ? "animate-spin" : ""} />
                {portalLoading ? "A redirecionar..." : "Gerenciar Assinatura e Cartão"}
              </button>
            </div>
          </div>

          <div className="bg-custom-card border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText size={18} className="text-custom-primary" />
              Histórico de Faturas
            </h3>

            {subInfo.invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-left opacity-70 text-xs uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Data</th>
                      <th className="pb-3 font-semibold">Valor</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Fatura</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {subInfo.invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-white/[0.02] transition">
                        <td className="py-4 text-sm font-medium">{inv.date}</td>
                        <td className="py-4 text-sm font-bold">R$ {inv.total}</td>
                        <td className="py-4 text-sm">
                          <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-right">
                          {inv.invoice_pdf && (
                            <a
                              href={inv.invoice_pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-custom-primary hover:text-white hover:bg-custom-primary text-xs font-bold bg-custom-primary/15 border border-custom-primary/30 px-3 py-1.5 rounded-lg transition-all"
                            >
                              <Download size={14} />
                              Baixar PDF
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 opacity-60 text-sm bg-black/20 rounded-xl border border-white/5">
                <FileText size={32} className="mx-auto mb-3 opacity-50" />
                <p>Ainda não existem faturas emitidas para esta conta.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* =========================================================================
           TELA 2: CLIENTE NÃO TEM ASSINATURA (MOSTRA A TELA DE VENDAS)
           ========================================================================= */
        <div className="flex justify-center py-4">
          <div className="bg-custom-card border border-white/10 rounded-2xl p-8 shadow-xl max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-custom-primary/10 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="text-center mb-6 relative z-10">
              <span className="bg-custom-primary/20 text-custom-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                7 Dias Grátis
              </span>
              <h2 className="text-2xl font-bold mt-4">Plano Profissional</h2>
              <p className="text-3xl font-extrabold text-white mt-2">R$ 49,99<span className="text-sm font-normal opacity-60"> / mês</span></p>
            </div>

            <button
              onClick={handleAssinar}
              disabled={loading}
              className="w-full bg-custom-primary hover:brightness-110 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-custom-primary/20 relative z-10"
            >
              {loading ? (
                <span className="animate-pulse">A preparar ambiente seguro...</span>
              ) : (
                <>
                  <CreditCard size={18} />
                  Começar Teste Gratuito
                </>
              )}
            </button>
            
            <p className="text-center text-xs opacity-60 flex items-center justify-center gap-1 mb-6 relative z-10">
              <ShieldCheck size={14} />
              Cancele quando quiser. Sem fidelidade.
            </p>

            <div className="space-y-3 pt-4 border-t border-white/10 relative z-10">
              <Feature text="Agendamentos Ilimitados" />
              <Feature text="Avisos automáticos no WhatsApp" />
              <Feature text="Página de agendamento exclusiva" />
              <Feature text="Gestão de profissionais e comissões" />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

// Subcomponente para renderizar os itens da lista do plano
function Feature({ text }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="bg-custom-primary/20 p-1 rounded-full text-custom-primary flex-shrink-0">
        <Check size={14} strokeWidth={3} />
      </div>
      <span className="font-medium opacity-90">{text}</span>
    </div>
  );
}