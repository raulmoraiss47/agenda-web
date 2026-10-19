"use client";

import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import api from "@/services/api";
import DashboardLayout from "@/components/DashboardLayout";

export default function CompanySettingsPage() {
  const defaultSettings = {
    logo: null,
    theme: {
      primary_color: "#2563eb",
      bg_color: "#0f172a",
      card_color: "#1e293b",
      text_color: "#f8fafc",
    },
    business_hours: {
      0: { enabled: false, start: "", lunch_start: "", lunch_end: "", end: "" },
      1: { enabled: true, start: "08:00", lunch_start: "12:00", lunch_end: "13:00", end: "18:00" },
      2: { enabled: true, start: "08:00", lunch_start: "12:00", lunch_end: "13:00", end: "18:00" },
      3: { enabled: true, start: "08:00", lunch_start: "12:00", lunch_end: "13:00", end: "18:00" },
      4: { enabled: true, start: "08:00", lunch_start: "12:00", lunch_end: "13:00", end: "18:00" },
      5: { enabled: true, start: "08:00", lunch_start: "12:00", lunch_end: "13:00", end: "18:00" },
      6: { enabled: true, start: "08:00", lunch_start: "", lunch_end: "", end: "12:00" },
    },
  };

  const weekdays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("company");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    phone: "",
    email: "",
    active: true,
    logo: null,
    settings: defaultSettings,
  });

  // 🔥 LOAD COMPANY
  async function loadCompany() {
    try {
      const res = await api.get("/company");
      const data = res.data || {};

      setForm({
        name: data.name || "",
        slug: data.slug || "",
        phone: data.phone || "",
        email: data.email || "",
        active: data.active ?? true,
        logo: data.logo || null,
        settings: {
          ...defaultSettings,
          ...(data.settings || {}),
          theme: {
            ...defaultSettings.theme,
            ...(data.settings?.theme || {}),
          },
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  // 💾 SAVE
  async function handleSave() {
    try {
      setLoading(true);

      await api.put("/company", {
        name: form.name,
        slug: form.slug,
        phone: form.phone,
        email: form.email,
        active: form.active,
      });

      if (logoFile) {
        const logoData = new FormData();
        logoData.append("logo", logoFile);
        await api.post("/company/logo", logoData);
      }

      alert("Empresa atualizada!");
      loadCompany();
    } catch (err) {
      console.error(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  }

  // 🎨 UPDATE THEME
  function updateTheme(key, value) {
    setForm((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme: {
          ...prev.settings?.theme,
          [key]: value,
        },
      },
    }));
  }

  function updateBusinessHour(day, field, value) {
    setForm((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        business_hours: {
          ...prev.settings.business_hours,
          [day]: {
            ...prev.settings.business_hours[day],
            [field]: value,
          },
        },
      },
    }));
  }

  async function handleSaveSettings() {
    try {
      await api.patch("/company/settings", form.settings);
      alert("Configurações salvas!");
    } catch (error) {
      console.error(error);
    }
  }

  function handleRemoveLogo() {
    setLogoFile(null);
    setForm((prev) => ({
      ...prev,
      logo: null,
    }));
  }

  useEffect(() => {
    loadCompany();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="opacity-70 mt-1">Gerencie os dados e aparência da sua empresa</p>
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        <button
          onClick={() => setTab("company")}
          className={`px-4 py-2 rounded-xl transition-colors ${
            tab === "company" ? "bg-custom-primary text-white" : "bg-custom-card opacity-70 hover:opacity-100 border border-white/10"
          }`}
        >
          Empresa
        </button>

        <button
          onClick={() => setTab("hours")}
          className={`px-4 py-2 rounded-xl transition-colors ${
            tab === "hours" ? "bg-custom-primary text-white" : "bg-custom-card opacity-70 hover:opacity-100 border border-white/10"
          }`}
        >
          Horários
        </button>

        <button
          onClick={() => setTab("theme")}
          className={`px-4 py-2 rounded-xl transition-colors ${
            tab === "theme" ? "bg-custom-primary text-white" : "bg-custom-card opacity-70 hover:opacity-100 border border-white/10"
          }`}
        >
          Personalização
        </button>
      </div>

      {/* FORM: EMPRESA */}
      {tab === "company" && (
        <div className="mt-6 bg-custom-card border border-white/10 rounded-2xl p-6 max-w-2xl space-y-4 transition-colors">
          {/* LOGO */}
          <div className="flex items-start gap-4">
            <label className="relative flex flex-col items-center justify-center w-40 h-40 rounded-2xl border-2 border-dashed border-white/20 bg-black/20 hover:border-custom-primary cursor-pointer overflow-hidden transition">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="hidden"
              />

              {logoFile ? (
                <img
                  src={URL.createObjectURL(logoFile)}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : form.logo ? (
                <img
                  src={`http://127.0.0.1:9000/storage/${form.logo}`}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-xs opacity-70">Adicionar logo</p>
                </div>
              )}
            </label>

            {(logoFile || form.logo) && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-sm text-white transition-colors"
              >
                Remover
              </button>
            )}
          </div>

          <input
            placeholder="Nome da empresa"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-custom-text outline-none focus:border-custom-primary transition-colors"
          />

          <input
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-custom-text outline-none focus:border-custom-primary transition-colors"
          />

          <input
            placeholder="Telefone"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-custom-text outline-none focus:border-custom-primary transition-colors"
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-custom-text outline-none focus:border-custom-primary transition-colors"
          />

          {/* ACTIVE */}
          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
              className="w-5 h-5 accent-custom-primary rounded bg-black/20 border-white/10"
            />
            <span className="opacity-90 font-medium">Empresa ativa no sistema</span>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2.5 bg-custom-primary hover:brightness-110 rounded-xl text-white font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar Dados"}
            </button>
          </div>
        </div>
      )}

      {/* FORM: HORÁRIOS */}
      {tab === "hours" && (
        <div className="mt-6 bg-custom-card border border-white/10 rounded-2xl p-6 transition-colors">
          <h2 className="text-xl font-semibold mb-6">Horário de Funcionamento</h2>
          <div className="space-y-4">
            {weekdays.map((dayName, index) => {
              const day = form.settings?.business_hours?.[index];
              return (
                <div key={index} className="border border-white/10 rounded-xl p-4 bg-black/20">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      checked={day?.enabled || false}
                      onChange={(e) => updateBusinessHour(index, "enabled", e.target.checked)}
                      className="w-5 h-5 accent-custom-primary"
                    />
                    <span className="font-medium">{dayName}</span>
                  </div>

                  {day?.enabled && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs opacity-60 mb-1 block">Início</label>
                        <input
                          type="time"
                          value={day.start || ""}
                          onChange={(e) => updateBusinessHour(index, "start", e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-custom-text outline-none focus:border-custom-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs opacity-60 mb-1 block">Almoço início</label>
                        <input
                          type="time"
                          value={day.lunch_start || ""}
                          onChange={(e) => updateBusinessHour(index, "lunch_start", e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-custom-text outline-none focus:border-custom-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs opacity-60 mb-1 block">Almoço fim</label>
                        <input
                          type="time"
                          value={day.lunch_end || ""}
                          onChange={(e) => updateBusinessHour(index, "lunch_end", e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-custom-text outline-none focus:border-custom-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs opacity-60 mb-1 block">Encerramento</label>
                        <input
                          type="time"
                          value={day.end || ""}
                          onChange={(e) => updateBusinessHour(index, "end", e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-custom-text outline-none focus:border-custom-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2.5 bg-custom-primary hover:brightness-110 rounded-xl text-white font-medium transition-colors"
            >
              Salvar Horários
            </button>
          </div>
        </div>
      )}

      {/* FORM: PERSONALIZAÇÃO / THEME */}
      {tab === "theme" && (
        <div className="mt-6 bg-custom-card border border-white/10 rounded-2xl p-6 space-y-6 transition-colors">
          <h2 className="text-lg font-semibold">Cores do Sistema Público</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 1. Cor Principal */}
            <div>
              <label className="text-sm font-medium opacity-80 block mb-3">Cor Principal</label>
              <HexColorPicker
                color={form.settings?.theme?.primary_color}
                onChange={(color) => updateTheme("primary_color", color)}
                style={{ width: '100%', height: '150px' }}
              />
              <p className="text-xs opacity-50 mt-2 font-mono">{form.settings?.theme?.primary_color}</p>
            </div>

            {/* 2. Cor de Fundo */}
            <div>
              <label className="text-sm font-medium opacity-80 block mb-3">Fundo da Página</label>
              <HexColorPicker
                color={form.settings?.theme?.bg_color}
                onChange={(color) => updateTheme("bg_color", color)}
                style={{ width: '100%', height: '150px' }}
              />
              <p className="text-xs opacity-50 mt-2 font-mono">{form.settings?.theme?.bg_color}</p>
            </div>

            {/* 3. Cor dos Cards */}
            <div>
              <label className="text-sm font-medium opacity-80 block mb-3">Fundo dos Cards</label>
              <HexColorPicker
                color={form.settings?.theme?.card_color}
                onChange={(color) => updateTheme("card_color", color)}
                style={{ width: '100%', height: '150px' }}
              />
              <p className="text-xs opacity-50 mt-2 font-mono">{form.settings?.theme?.card_color}</p>
            </div>

            {/* 4. Cor do Texto */}
            <div>
              <label className="text-sm font-medium opacity-80 block mb-3">Cor do Texto</label>
              <HexColorPicker
                color={form.settings?.theme?.text_color}
                onChange={(color) => updateTheme("text_color", color)}
                style={{ width: '100%', height: '150px' }}
              />
              <p className="text-xs opacity-50 mt-2 font-mono">{form.settings?.theme?.text_color}</p>
            </div>
          </div>

          {/* PREVIEW DINÂMICO DA TELA DO CLIENTE */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-4">Preview ao vivo</h3>
            <div 
              className="p-8 rounded-2xl border border-white/10 transition-colors shadow-inner"
              style={{
                backgroundColor: form.settings?.theme?.bg_color,
                color: form.settings?.theme?.text_color
              }}
            >
              <div className="max-w-md mx-auto">
                <div 
                  className="p-6 rounded-xl shadow-xl border border-white/5 transition-colors"
                  style={{ backgroundColor: form.settings?.theme?.card_color }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: form.settings?.theme?.primary_color }}>
                      {form.name ? form.name.charAt(0) : "S"}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{form.name || "Sua Empresa"}</h4>
                      <p className="text-sm opacity-80">Agendamento Online</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="h-10 w-full rounded-lg border border-current opacity-20 border-dashed"></div>
                    <div className="h-10 w-full rounded-lg border border-current opacity-20 border-dashed"></div>
                  </div>

                  <button 
                    className="w-full py-3 rounded-xl font-semibold transition shadow-lg hover:brightness-110"
                    style={{ backgroundColor: form.settings?.theme?.primary_color, color: '#ffffff' }}
                  >
                    Confirmar Agendamento
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTÃO SALVAR CORES */}
          <div className="flex justify-end pt-4 border-t border-white/10">
            <button 
              onClick={handleSaveSettings} 
              className="px-6 py-2.5 bg-custom-primary hover:brightness-110 rounded-xl text-white font-medium transition-colors"
            >
              Salvar Layout
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}