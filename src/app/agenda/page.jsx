"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/services/api";

import DashboardLayout from "@/components/DashboardLayout";

import {
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
} from "lucide-react";


export default function AgendaPage() {
  const [appointments, setAppointments] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [company, setCompany] = useState(null);

  const [form, setForm] = useState({
    client_id: "",
    professional_id: "",
    service_id: "",
    date: "",
    time: "",
    notes: "",
  });

  const dayIndex = currentDate.getDay();
  const daySettings = company?.settings?.business_hours?.[dayIndex];

  const horarios = useMemo(() => {
    const daySettings = company?.settings?.business_hours?.[currentDate.getDay()];

    if (!daySettings?.enabled) return [];

    return generateTimeSlots(daySettings);
  }, [company, currentDate]);

  async function loadCompany() {
    try {
      const response = await api.get("/company");
      setCompany(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadAppointments(date) {
    try {
      const formattedDate = date.toISOString().split("T")[0];

      const response = await api.get(
        `/appointments?date=${formattedDate}`
      );

      setAppointments(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  function nextDay() {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  }

  function previousDay() {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  }

  function goToday() {
    setCurrentDate(new Date());
  }

  function getStatusColor(status) {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500/20 text-green-400";

      case "FINISHED":
        return "bg-blue-500/20 text-blue-400";

      case "CANCELED":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  }

  async function loadFormData() {
    try {

      const [
        clientsResponse,
        professionalsResponse,
        servicesResponse
      ] = await Promise.all([
        api.get("/clients"),
        api.get("/professionals"),
        api.get("/services"),
      ]);

      setClientes(clientsResponse.data);
      setProfissionais(professionalsResponse.data);
      setServicos(servicesResponse.data);

    } catch (error) {
      console.error(error);
    }
  }

  async function handleSaveAppointment() {
    try {
        const service = servicos.find(
          (s) => s.id == form.service_id
        );

        // cria start no horário local
        const [year, month, day] = form.date.split("-");
        const [hour, minute] = form.time.split(":");

        const startDate = new Date(
          year,
          month - 1,
          day,
          hour,
          minute,
          0
        );

        // duração
        const endDate = new Date(startDate);
        endDate.setMinutes(
          endDate.getMinutes() + Number(service.duration_minutes)
        );

        // formatador seguro local (sem UTC)
        const format = (d) =>
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
            d.getDate()
          ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
            d.getMinutes()
          ).padStart(2, "0")}:00`;

        const startDateTime = format(startDate);
        const endDateTime = format(endDate);

        await api.post("/appointments", {
          client_id: form.client_id,
          professional_id: form.professional_id,
          service_id: form.service_id,
          start_datetime: startDateTime,
          end_datetime: endDateTime,
          notes: form.notes,
        });

      setModalOpen(false);

      setForm({
        client_id: "",
        professional_id: "",
        service_id: "",
        date: "",
        time: "",
        notes: "",
      });

      loadAppointments(currentDate);

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Erro ao salvar"
      );
    }
  }

  async function handleFinishAppointment(id) {
    try {

      await api.put(`/appointments/${id}`, {
        status: "FINISHED"
      });

      loadAppointments(currentDate);

    } catch (error) {
      console.error(error);
    }
  }

  async function handleCancelAppointment(id) {

    const confirmar = confirm(
      "Deseja cancelar este agendamento?"
    );

    if (!confirmar) return;

    try {

      await api.put(`/appointments/${id}`, {
        status: "CANCELED"
      });

      loadAppointments(currentDate);

    } catch (error) {
      console.error(error);
    }
  }

  function handleEditAppointment(appointment) {
    setSelectedAppointment({
      ...appointment,
      date: appointment.start_datetime.substring(0, 10),
      time: appointment.start_datetime.substring(11, 16),
    });

    setEditModalOpen(true);
  }

  async function handleUpdateAppointment() {
    try {

      const service = servicos.find(
        (s) => s.id == selectedAppointment.service_id
      );

      const startDateTime =
        `${selectedAppointment.date} ${selectedAppointment.time}:00`;

      const endDate = new Date(
        `${selectedAppointment.date}T${selectedAppointment.time}:00`
      );

      endDate.setMinutes(
        endDate.getMinutes() +
        service.duration_minutes
      );

      const endDateTime =
        endDate.toISOString()
        .slice(0, 19)
        .replace("T", " ");

      await api.put(
        `/appointments/${selectedAppointment.id}`,
        {
          client_id: selectedAppointment.client_id,
          professional_id: selectedAppointment.professional_id,
          service_id: selectedAppointment.service_id,
          start_datetime: startDateTime,
          end_datetime: endDateTime,
          notes: selectedAppointment.notes,
        }
      );

      setEditModalOpen(false);

      loadAppointments(currentDate);

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Erro ao atualizar"
      );
    }
  }

  function getCardColor(status) {
    switch (status) {

      case "CONFIRMED":
        return "bg-green-500/10 border-green-500/30";

      case "FINISHED":
        return "bg-green-500/10 border-green-500/30";

      case "CANCELED":
        return "bg-red-500/10 border-red-500/30";

      default:
        return "bg-yellow-500/10 border-yellow-500/30";
    }
  }

  function getStatusLabel(status) {

    switch (status) {

      case "CONFIRMED":
        return "Confirmado";

      case "FINISHED":
        return "Concluído";

      case "CANCELED":
        return "Cancelado";

      default:
        return "Pendente";
    }
  }

  function generateTimeSlots(daySettings) {
    if (!daySettings?.start || !daySettings?.end) return [];

    const {
      start,
      end,
      lunch_start,
      lunch_end,
    } = daySettings;

    const interval_minutes = 30;

    const slots = [];

    let current = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);

    while (current < endDate) {
      const time = current.toTimeString().slice(0, 5);

      const isLunch =
        lunch_start &&
        lunch_end &&
        time >= lunch_start &&
        time < lunch_end;

      if (!isLunch) slots.push(time);

      current.setMinutes(current.getMinutes() + interval_minutes);
    }

    return slots;
  }

  useEffect(() => {
    loadCompany();
  }, []);

  useEffect(() => {
    loadAppointments(currentDate);
  }, [currentDate]);

  useEffect(() => {
    loadFormData();
  }, []);

  return (
    <DashboardLayout>

      {/* CABEÇALHO */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Agenda
          </h1>

          <p className="text-slate-400">
            Gerencie seus agendamentos
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="
            flex items-center gap-2
            bg-blue-600
            hover:bg-blue-700
            px-5 py-3
            rounded-xl
          "
        >
          <Plus size={18} />
          Novo Agendamento
        </button>
      </div>

      {/* DATA */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={previousDay}
            className="p-2 rounded-lg hover:bg-slate-800"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={nextDay}
            className="p-2 rounded-lg hover:bg-slate-800"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <h2 className="font-semibold text-lg capitalize">
          {currentDate.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          onClick={goToday}
          className="
            bg-slate-800
            px-4
            py-2
            rounded-lg
            hover:bg-slate-700
          "
        >
          Hoje
        </button>
      </div>


      {/* AGENDA POR PROFISSIONAL */}
      <div className="overflow-auto">

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-slate-950">

              <th className="p-4 border border-slate-800 text-left">
                Horário
              </th>

              {profissionais.map((profissional) => (
                <th
                  key={profissional.id}
                  className="p-4 border border-slate-800 text-left"
                >
                  {profissional.name}
                </th>
              ))}

            </tr>

          </thead>

          <tbody>

            {horarios.map((hora) => (

              <tr key={hora}>

                <td
                  className="
                    p-4
                    border
                    border-slate-800
                    font-semibold
                    bg-slate-950
                  "
                >
                  {hora}
                </td>

                {profissionais.map((profissional) => {

                  const appointment =
                    appointments.find((item) => {

                      const inicio = item.start_datetime.substring(11, 16);

                      const [h, m] = inicio.split(":");

                      const bloco =
                        Number(m) < 30
                          ? `${h}:00`
                          : `${h}:30`;

                      return (
                        item.professional_id === profissional.id &&
                        bloco === hora
                      );
                    });
                  return (
                    <td
                      key={profissional.id}
                      className="
                        border
                        border-slate-800
                        p-2
                        min-w-[220px]
                        align-top
                      "
                    >

                      {appointment ? (

                            <div
                              className={`
                                border
                                rounded-xl
                                p-3
                                ${getCardColor(appointment.status)}
                              `}
                            >

                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                            {appointment.client?.name?.charAt(0)}
                          </div>

                          <p className="text-sm text-slate-400">
                            {appointment.service?.name}
                          </p>

                          <p className="text-green-400 text-sm mt-1">
                            R$ {appointment.service?.price}
                          </p>

                          <div className="flex items-center gap-2 text-sm text-slate-400 mt-2">
                            <Clock size={14} />
                            {appointment.start_datetime.substring(11,16)}
                            {" - "}
                            {appointment.end_datetime.substring(11,16)}
                          </div>
                          <span
                            className={`
                              inline-block
                              mt-2
                              px-2
                              py-1
                              rounded-lg
                              text-xs
                              ${getStatusColor(appointment.status)}
                            `}
                          >
                            {getStatusLabel(appointment.status)}
                          </span>

                          <div className="flex gap-2 mt-3">

                            {appointment.status !== "CANCELED" && (
                              <button
                                onClick={() => handleCancelAppointment(appointment.id)}
                                className="
                                  px-2 py-1
                                  text-xs
                                  rounded-lg
                                  bg-red-600
                                  hover:bg-red-700
                                "
                              >
                                Cancelar
                              </button>
                            )}

                            <button
                              onClick={() => handleEditAppointment(appointment)}
                              className="
                                px-2 py-1
                                text-xs
                                rounded-lg
                                bg-blue-600
                                hover:bg-blue-700
                              "
                            >
                              Editar
                            </button>

                            {appointment.status !== "FINISHED" && (
                              <button
                                onClick={() => handleFinishAppointment(appointment.id)}
                                className="
                                  px-2 py-1
                                  text-xs
                                  rounded-lg
                                  bg-green-600
                                  hover:bg-green-700
                                "
                              >
                                Concluir
                              </button>
                            )}

                          </div>

                        </div>

                      ) : (

                        <span className="text-slate-500 text-sm">
                          Livre
                        </span>

                      )}

                    </td>
                  );
                })}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {modalOpen && (
      <div
        className="
          fixed inset-0
          bg-black/70
          flex items-center justify-center
          z-50
        "
      >

        <div
          className="
            bg-slate-900
            border border-slate-800
            rounded-2xl
            p-6
            w-full
            max-w-xl
          "
        >

          <h2 className="text-2xl font-bold mb-6">
            Novo Agendamento
          </h2>

          <div className="space-y-4">

            <select
              value={form.client_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  client_id: e.target.value
                })
              }
              className="
                w-full
                bg-slate-800
                border border-slate-700
                rounded-xl
                p-3
              "
            >
              <option value="">
                Selecione o Cliente
              </option>

              {clientes.map((cliente) => (
                <option
                  key={cliente.id}
                  value={cliente.id}
                >
                  {cliente.name}
                </option>
              ))}
            </select>

            <select
              value={form.professional_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  professional_id: e.target.value
                })
              }
              className="
                w-full
                bg-slate-800
                border border-slate-700
                rounded-xl
                p-3
              "
            >
              <option value="">
                Selecione o Profissional
              </option>

              {profissionais.map((profissional) => (
                <option
                  key={profissional.id}
                  value={profissional.id}
                >
                  {profissional.name}
                </option>
              ))}
            </select>

            <select
              value={form.service_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  service_id: e.target.value
                })
              }
              className="
                w-full
                bg-slate-800
                border border-slate-700
                rounded-xl
                p-3
              "
            >
              <option value="">
                Selecione o Serviço
              </option>

              {servicos.map((service) => (
                <option
                  key={service.id}
                  value={service.id}
                >
                  {service.name}
                  {" - "}
                  R$ {service.price}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value
                })
              }
              className="
                w-full
                bg-slate-800
                border border-slate-700
                rounded-xl
                p-3
              "
            />

            <input
              type="time"
              value={form.time}
              onChange={(e) =>
                setForm({
                  ...form,
                  time: e.target.value
                })
              }
              className="
                w-full
                bg-slate-800
                border border-slate-700
                rounded-xl
                p-3
              "
            />

            <textarea
              rows="3"
              placeholder="Observações"
              value={form.notes}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value
                })
              }
              className="
                w-full
                bg-slate-800
                border border-slate-700
                rounded-xl
                p-3
              "
            />

          </div>

          <div className="flex justify-end gap-3 mt-6">

            <button
              onClick={() => setModalOpen(false)}
              className="
                px-4 py-2
                bg-slate-700
                rounded-xl
              "
            >
              Cancelar
            </button>

            <button
              onClick={handleSaveAppointment}
              className="
                px-4 py-2
                bg-blue-600
                hover:bg-blue-700
                rounded-xl
              "
            >
              Salvar
            </button>

          </div>

        </div>

      </div>
      )}

      {editModalOpen && selectedAppointment && (
        <div
          className="
            fixed inset-0
            bg-black/70
            flex items-center justify-center
            z-50
          "
        >

          <div
            className="
              bg-slate-900
              border border-slate-800
              rounded-2xl
              p-6
              w-full
              max-w-xl
            "
          >

            <h2 className="text-2xl font-bold mb-6">
              Editar Agendamento
            </h2>

            <div className="space-y-4">

              <select
                value={selectedAppointment.client_id}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    client_id: e.target.value
                  })
                }
                className="
                  w-full
                  bg-slate-800
                  border border-slate-700
                  rounded-xl
                  p-3
                "
              >
                {clientes.map((cliente) => (
                  <option
                    key={cliente.id}
                    value={cliente.id}
                  >
                    {cliente.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedAppointment.professional_id}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    professional_id: e.target.value
                  })
                }
                className="
                  w-full
                  bg-slate-800
                  border border-slate-700
                  rounded-xl
                  p-3
                "
              >
                {profissionais.map((profissional) => (
                  <option
                    key={profissional.id}
                    value={profissional.id}
                  >
                    {profissional.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedAppointment.service_id}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    service_id: e.target.value
                  })
                }
                className="
                  w-full
                  bg-slate-800
                  border border-slate-700
                  rounded-xl
                  p-3
                "
              >
                {servicos.map((service) => (
                  <option
                    key={service.id}
                    value={service.id}
                  >
                    {service.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={selectedAppointment.date}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    date: e.target.value
                  })
                }
                className="
                  w-full
                  bg-slate-800
                  border border-slate-700
                  rounded-xl
                  p-3
                "
              />

              <input
                type="time"
                value={selectedAppointment.time}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    time: e.target.value
                  })
                }
                className="
                  w-full
                  bg-slate-800
                  border border-slate-700
                  rounded-xl
                  p-3
                "
              />

              <textarea
                rows="3"
                value={selectedAppointment.notes || ""}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    notes: e.target.value
                  })
                }
                className="
                  w-full
                  bg-slate-800
                  border border-slate-700
                  rounded-xl
                  p-3
                "
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setEditModalOpen(false)}
                className="
                  px-4 py-2
                  bg-slate-700
                  rounded-xl
                "
              >
                Cancelar
              </button>

              <button
                onClick={handleUpdateAppointment}
                className="
                  px-4 py-2
                  bg-blue-600
                  hover:bg-blue-700
                  rounded-xl
                "
              >
                Salvar Alterações
              </button>

            </div>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}