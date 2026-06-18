"use client";

import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import api from "@/services/api";
import DashboardLayout from "@/components/DashboardLayout";

import axios from "axios";


export default function CompanySettingsPage() {
  const defaultSettings = {
    logo: null,

    theme: {
      primary_color: "#2563eb",
    },

    business_hours: {
      0: {
        enabled: false,
        start: "",
        lunch_start: "",
        lunch_end: "",
        end: "",
      },

      1: {
        enabled: true,
        start: "08:00",
        lunch_start: "12:00",
        lunch_end: "13:00",
        end: "18:00",
      },

      2: {
        enabled: true,
        start: "08:00",
        lunch_start: "12:00",
        lunch_end: "13:00",
        end: "18:00",
      },

      3: {
        enabled: true,
        start: "08:00",
        lunch_start: "12:00",
        lunch_end: "13:00",
        end: "18:00",
      },

      4: {
        enabled: true,
        start: "08:00",
        lunch_start: "12:00",
        lunch_end: "13:00",
        end: "18:00",
      },

      5: {
        enabled: true,
        start: "08:00",
        lunch_start: "12:00",
        lunch_end: "13:00",
        end: "18:00",
      },

      6: {
        enabled: true,
        start: "08:00",
        lunch_start: "",
        lunch_end: "",
        end: "12:00",
      },
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

      // Atualiza dados da empresa
      await api.put("/company", {
        name: form.name,
        slug: form.slug,
        phone: form.phone,
        email: form.email,
        active: form.active,
      });

      // Upload da logo
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

      await api.patch(
        "/company/settings",
        form.settings
      );

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
        <p className="text-slate-400">
          Gerencie os dados e aparência da sua empresa
        </p>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={() => setTab("company")}
          className={`px-4 py-2 rounded-xl ${
            tab === "company"
              ? "bg-blue-600"
              : "bg-slate-800"
          }`}
        >
          Empresa
        </button>

        <button
          onClick={() => setTab("hours")}
          className={`px-4 py-2 rounded-xl ${
            tab === "hours"
              ? "bg-blue-600"
              : "bg-slate-800"
          }`}
        >
          Horários
        </button>

        <button
          onClick={() => setTab("theme")}
          className={`px-4 py-2 rounded-xl ${
            tab === "theme"
              ? "bg-blue-600"
              : "bg-slate-800"
          }`}
        >
          Personalização
        </button>
      </div>

      {/* FORM */}
     {tab === "company" && (
      <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl space-y-4">

        {/* LOGO */}
        <div className="flex items-start gap-4">

          <label
            className="
              relative
              flex
              items-center
              justify-center
              w-40
              h-40
              rounded-2xl
              border-2
              border-dashed
              border-slate-700
              bg-slate-800
              hover:border-blue-500
              cursor-pointer
              overflow-hidden
              transition
            "
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setLogoFile(e.target.files?.[0] || null)
              }
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
                <p className="text-xs text-slate-400">
                  Adicionar logo
                </p>
              </div>
            )}
          </label>

          {(logoFile || form.logo) && (
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="
                px-4
                py-2
                bg-red-600
                hover:bg-red-700
                rounded-xl
                text-sm
              "
            >
              X
            </button>
          )}

        </div>

        <input
          placeholder="Nome da empresa"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
        />

        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, slug: e.target.value }))
          }
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
        />

        <input
          placeholder="Telefone"
          value={form.phone}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, phone: e.target.value }))
          }
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
        />

        {/* ACTIVE */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, active: e.target.checked }))
            }
          />
          <span className="text-slate-300">Empresa ativa</span>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
     )}

     {tab === "hours" && (
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-xl font-semibold mb-6">
            Horário de Funcionamento
          </h2>

          <div className="space-y-4">

            {weekdays.map((dayName, index) => {

              const day =
                form.settings?.business_hours?.[index];

              return (

                <div
                  key={index}
                  className="border border-slate-800 rounded-xl p-4"
                >

                  <div className="flex items-center gap-3 mb-4">

                    <input
                      type="checkbox"
                      checked={day?.enabled || false}
                      onChange={(e) =>
                        updateBusinessHour(
                          index,
                          "enabled",
                          e.target.checked
                        )
                      }
                    />

                    <span className="font-medium">
                      {dayName}
                    </span>

                  </div>

                  {day?.enabled && (

                    <div className="grid md:grid-cols-4 gap-3">

                      <div>
                        <label className="text-xs text-slate-400">
                          Início
                        </label>

                        <input
                          type="time"
                          value={day.start || ""}
                          onChange={(e) =>
                            updateBusinessHour(
                              index,
                              "start",
                              e.target.value
                            )
                          }
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">
                          Almoço início
                        </label>

                        <input
                          type="time"
                          value={day.lunch_start || ""}
                          onChange={(e) =>
                            updateBusinessHour(
                              index,
                              "lunch_start",
                              e.target.value
                            )
                          }
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">
                          Almoço fim
                        </label>

                        <input
                          type="time"
                          value={day.lunch_end || ""}
                          onChange={(e) =>
                            updateBusinessHour(
                              index,
                              "lunch_end",
                              e.target.value
                            )
                          }
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400">
                          Encerramento
                        </label>

                        <input
                          type="time"
                          value={day.end || ""}
                          onChange={(e) =>
                            updateBusinessHour(
                              index,
                              "end",
                              e.target.value
                            )
                          }
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2"
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
              className="
                px-4 py-2
                bg-blue-600
                hover:bg-blue-700
                rounded-xl
              "
            >
              Salvar Horários
            </button>

          </div>

        </div>

      )}

      {/* PERSONALIZAÇÃO */}
      {tab === "theme" && (
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl space-y-4">

          <h2 className="text-lg font-semibold text-white">
            Personalização
          </h2>

          <div>
            <label className="text-sm text-slate-400">
              Cor principal
            </label>

            <div className="mt-2">
              <HexColorPicker
                color={form.settings?.theme?.primary_color}
                onChange={(color) =>
                  updateTheme("primary_color", color)
                }
              />
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Essa cor será usada no sistema da empresa
            </p>
          </div>

          <div
            className="mt-4 p-4 rounded-xl text-white"
            style={{
              backgroundColor: form.settings?.theme?.primary_color,
            }}
          >
            Preview da cor: {form.settings?.theme?.primary_color}
          </div>
      </div>
      )}
    </DashboardLayout>
  );
}