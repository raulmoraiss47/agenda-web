"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip
} from "recharts";

const data = [
  { dia: "Seg", agendamentos: 12 },
  { dia: "Ter", agendamentos: 19 },
  { dia: "Qua", agendamentos: 15 },
  { dia: "Qui", agendamentos: 27 },
  { dia: "Sex", agendamentos: 34 },
  { dia: "Sab", agendamentos: 22 },
  { dia: "Dom", agendamentos: 8 },
];

export default function WeeklyChart() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Agendamentos da Semana
        </h2>

        <p className="text-slate-400 text-sm">
          Visão geral dos últimos dias
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="dia"
              stroke="#94a3b8"
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="agendamentos"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}