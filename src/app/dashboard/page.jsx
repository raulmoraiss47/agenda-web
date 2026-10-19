"use client";

import DashboardLayout from "@/components/DashboardLayout";
import WeeklyChart from "@/components/WeeklyChart";

import { useEffect, useState } from "react";
import api from "@/services/api";

import {
  Calendar,
  Users,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle
} from "lucide-react";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  async function loadDashboard() {
    try {
      const response = await api.get("/dashboard");
      setDashboard(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <DashboardLayout>
      {/* TÍTULO */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-2xl font-bold">
            📅 Resumo do seu negócio
          </h4>

          <p className="opacity-70 mt-2 text-lg">
            Você possui{" "}
            <span className="text-custom-primary font-semibold">
              {dashboard?.agendamentosHoje ?? 0}
            </span>
            {" "}agendamentos para hoje.
          </p>
        </div>

        <div
          className="
            hidden
            md:flex
            items-center
            gap-3
            bg-custom-card
            border
            border-white/10
            px-5
            py-3
            rounded-2xl
          "
        >
          <div
            className="
              w-3
              h-3
              rounded-full
              bg-green-500
              animate-pulse
            "
          />
          <span className="opacity-80">
            Sistema Online
          </span>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        
        {/* AGENDAMENTOS */}
        <div
          className="
            bg-custom-card
            border border-white/10
            rounded-3xl
            p-6
            relative
            overflow-hidden
            hover:border-custom-primary/50
            hover:scale-[1.02]
            transition-all
          "
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-custom-primary/10 rounded-full blur-3xl" />

          <div className="flex justify-between items-center">
            <div>
              <p className="opacity-70 text-sm">
                Agendamentos Hoje
              </p>

              <h2 className="text-4xl font-bold mt-3">
                {dashboard?.agendamentosHoje ?? 0}
              </h2>

              <span
                className="
                  inline-block
                  mt-3
                  px-2
                  py-1
                  rounded-full
                  text-xs
                  bg-custom-primary/20
                  text-custom-primary
                  font-medium
                "
              >
                Hoje
              </span>
            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-custom-primary/20
                flex
                items-center
                justify-center
              "
            >
              <Calendar
                size={26}
                className="text-custom-primary"
              />
            </div>
          </div>
        </div>

        {/* CLIENTES */}
        <div
          className="
            bg-custom-card
            border border-white/10
            rounded-3xl
            p-6
            relative
            overflow-hidden
            hover:border-emerald-500/30
            hover:scale-[1.02]
            transition-all
          "
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="flex justify-between items-center">
            <div>
              <p className="opacity-70 text-sm">
                Clientes
              </p>

              <h2 className="text-4xl font-bold mt-3">
                {dashboard?.clientes ?? 0}
              </h2>

              <span
                className="
                  inline-block
                  mt-3
                  px-2
                  py-1
                  rounded-full
                  text-xs
                  bg-emerald-500/20
                  text-emerald-400
                  font-medium
                "
              >
                Cadastrados
              </span>
            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-emerald-500/20
                flex
                items-center
                justify-center
              "
            >
              <Users
                size={26}
                className="text-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* SERVIÇOS */}
        <div
          className="
            bg-custom-card
            border border-white/10
            rounded-3xl
            p-6
            relative
            overflow-hidden
            hover:border-purple-500/30
            hover:scale-[1.02]
            transition-all
          "
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="flex justify-between items-center">
            <div>
              <p className="opacity-70 text-sm">
                Serviços
              </p>

              <h2 className="text-4xl font-bold mt-3">
                {dashboard?.servicos ?? 0}
              </h2>

              <span
                className="
                  inline-block
                  mt-3
                  px-2
                  py-1
                  rounded-full
                  text-xs
                  bg-purple-500/20
                  text-purple-400
                  font-medium
                "
              >
                Disponíveis
              </span>
            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-purple-500/20
                flex
                items-center
                justify-center
              "
            >
              <Briefcase
                size={26}
                className="text-purple-400"
              />
            </div>
          </div>
        </div>

        {/* RECEITA */}
        <div
          className="
            bg-custom-card
            border border-white/10
            rounded-3xl
            p-6
            relative
            overflow-hidden
            hover:border-yellow-500/30
            hover:scale-[1.02]
            transition-all
          "
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-3xl" />

          <div className="flex justify-between items-center">
            <div>
              <p className="opacity-70 text-sm">
                Receita do Mês
              </p>

              <h2 className="text-4xl font-bold mt-3">
                R$ {Number(dashboard?.receitaMes ?? 0).toFixed(2)}
              </h2>

              <span
                className="
                  inline-block
                  mt-3
                  px-2
                  py-1
                  rounded-full
                  text-xs
                  bg-yellow-500/20
                  text-yellow-400
                  font-medium
                "
              >
                Faturamento
              </span>
            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-yellow-500/20
                flex
                items-center
                justify-center
              "
            >
              <DollarSign
                size={26}
                className="text-yellow-400"
              />
            </div>
          </div>
        </div>

      </div>

      <div className="mb-8">
        <WeeklyChart />
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* PRÓXIMOS AGENDAMENTOS */}
        <div className="xl:col-span-2 bg-custom-card border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">
            Próximos Agendamentos
          </h2>

          <div className="space-y-3">
            {dashboard?.proximos?.map((appointment) => (
              <div
                key={appointment.id}
                className="
                  bg-black/20
                  border
                  border-white/5
                  rounded-xl
                  p-4
                  hover:border-custom-primary/50
                  hover:bg-black/30
                  transition-all
                  duration-200
                "
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div
                      className="
                        w-10
                        h-10
                        rounded-full
                        bg-custom-primary
                        text-white
                        flex
                        items-center
                        justify-center
                        font-semibold
                      "
                    >
                      {appointment.client?.name?.charAt(0)}
                    </div>

                    <div>
                      <p className="font-semibold">
                        {appointment.client?.name}
                      </p>

                      <p className="text-sm opacity-70">
                        {appointment.service?.name}
                      </p>

                      <p className="text-xs opacity-50 mt-1">
                        {appointment.professional?.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className="
                        bg-custom-primary/20
                        text-custom-primary
                        px-3
                        py-1
                        rounded-lg
                        text-sm
                        font-medium
                      "
                    >
                      {appointment.start_datetime.substring(11, 16)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ATIVIDADE RECENTE */}
        <div className="bg-custom-card border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">
            Atividade Recente
          </h2>

          <div className="space-y-5">
            <div className="flex gap-3">
              <CheckCircle size={18} className="text-green-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Cliente cadastrado</p>
                <span className="text-xs opacity-50">há 5 minutos</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock size={18} className="text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Agendamento criado</p>
                <span className="text-xs opacity-50">há 12 minutos</span>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle size={18} className="text-green-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Serviço atualizado</p>
                <span className="text-xs opacity-50">há 35 minutos</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}