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
    <div className="bg-custom-card border border-white/10 rounded-2xl p-6 transition-colors duration-500 text-custom-text">

      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Agendamentos da Semana
        </h2>

        <p className="opacity-60 text-sm mt-1">
          Visão geral dos últimos dias
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            
            {/* Eixo X com cor de texto adaptável */}
            <XAxis
              dataKey="dia"
              stroke="var(--color-text)"
              strokeOpacity={0.5}
              tick={{ fill: 'var(--color-text)', opacity: 0.7 }}
              axisLine={{ strokeOpacity: 0.2 }}
              tickLine={false}
            />

            {/* Tooltip customizado para obedecer ao tema */}
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-bg)', 
                borderColor: 'var(--color-card)',
                color: 'var(--color-text)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
              itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
            />

            {/* Linha do gráfico com a cor primária da empresa */}
            <Line
              type="monotone"
              dataKey="agendamentos"
              stroke="var(--color-primary)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-card)', stroke: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'var(--color-primary)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}