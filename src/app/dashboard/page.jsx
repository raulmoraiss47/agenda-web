export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    💈 Dashboard da Barbearia
                </h1>

                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                    + Novo Agendamento
                </button>
            </div>

            {/* CARDS RESUMO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                <div className="bg-white p-4 rounded-xl shadow">
                    <p className="text-gray-500">Agendamentos Hoje</p>
                    <h2 className="text-2xl font-bold">12</h2>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                    <p className="text-gray-500">Em Atendimento</p>
                    <h2 className="text-2xl font-bold">2</h2>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                    <p className="text-gray-500">Faturamento do Dia</p>
                    <h2 className="text-2xl font-bold">R$ 480</h2>
                </div>

            </div>

            {/* AGENDA DO DIA */}
            <div className="bg-white rounded-xl shadow p-4">
                <h2 className="text-xl font-semibold mb-4">
                    📅 Agenda de Hoje
                </h2>

                <div className="space-y-3">

                    {/* ITEM */}
                    <div className="flex items-center justify-between border-b pb-2">
                        <div>
                            <p className="font-semibold">Carlos Silva</p>
                            <p className="text-sm text-gray-500">Corte + Barba</p>
                        </div>

                        <div className="text-right">
                            <p className="font-medium">14:30</p>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                Confirmado
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                        <div>
                            <p className="font-semibold">João Pedro</p>
                            <p className="text-sm text-gray-500">Somente Corte</p>
                        </div>

                        <div className="text-right">
                            <p className="font-medium">15:00</p>
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                Aguardando
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">Rafael Lima</p>
                            <p className="text-sm text-gray-500">Barba + Sobrancelha</p>
                        </div>

                        <div className="text-right">
                            <p className="font-medium">16:00</p>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                Em breve
                            </span>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}