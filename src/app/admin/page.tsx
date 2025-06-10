"use client";

import { IconFlag, IconAward, IconMapPin } from "@tabler/icons-react";
import {
  getFourFanBrazilianResults,
  createRsfUser,
  updateDriverPodiumStats,
} from "@/lib/fourFanDB";
import { useEffect, useState } from "react";
import { RsfResult } from "@/types/supabase";
import RallyForm from "@/components/pages/admin/RallyForm";

export default function AdminDashboard() {
  const [brazilianResults, setBrazilianResults] = useState<RsfResult[]>([]);
  const [isCreatingUsers, setIsCreatingUsers] = useState(false);
  const [isUpdatingStats, setIsUpdatingStats] = useState(false);
  const [creationStatus, setCreationStatus] = useState<string>("");
  const [updateStatus, setUpdateStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "rallies">(
    "dashboard"
  );

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const results = await getFourFanBrazilianResults();
        setBrazilianResults(results);
      } catch (error) {
        console.error("Erro ao buscar resultados:", error);
      }
    };

    fetchResults();
  }, []);

  const handleCreateUsers = async () => {
    setIsCreatingUsers(true);
    setCreationStatus("Iniciando criação de usuários...");
    let created = 0;
    let errors = 0;

    try {
      for (const result of brazilianResults) {
        try {
          await createRsfUser({
            rsf_id: result.userid,
            name: result.real_name || result.user_name,
            nationality: result.nationality,
            victories: 0,
            first: 0,
            second: 0,
            third: 0,
          });
          created++;
          setCreationStatus(
            `Criados ${created} usuários de ${brazilianResults.length}...`
          );
        } catch (error) {
          console.error("Erro ao criar usuário:", error);
          errors++;
        }
      }

      setCreationStatus(
        `Concluído! ${created} usuários criados com sucesso. ${errors} erros.`
      );
    } catch {
      setCreationStatus("Erro ao criar usuários. Tente novamente.");
    } finally {
      setIsCreatingUsers(false);
    }
  };

  const handleUpdateStats = async () => {
    setIsUpdatingStats(true);
    setUpdateStatus("Iniciando atualização das estatísticas...");
    let updated = 0;
    let errors = 0;

    try {
      for (const result of brazilianResults) {
        try {
          await updateDriverPodiumStats(result.userid);
          updated++;
          setUpdateStatus(
            `Atualizados ${updated} usuários de ${brazilianResults.length}...`
          );
        } catch (error) {
          console.error("Erro ao atualizar estatísticas:", error);
          errors++;
        }
      }

      setUpdateStatus(
        `Concluído! ${updated} usuários atualizados com sucesso. ${errors} erros.`
      );
    } catch {
      setUpdateStatus("Erro ao atualizar estatísticas. Tente novamente.");
    } finally {
      setIsUpdatingStats(false);
    }
  };

  const stats = [
    {
      title: "Pilotos BR",
      value: brazilianResults.length.toString(),
      color: "bg-green-600",
      icon: <IconFlag className="w-5 h-5" />,
    },
  ];

  return (
    <div>
      {/* Navegação por abas */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "dashboard"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("rallies")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "rallies"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <IconMapPin className="w-4 h-4 inline mr-2" />
            Gerenciar Rallies
          </button>
        </nav>
      </div>

      {/* Conteúdo das abas */}
      {activeTab === "dashboard" && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden"
              >
                <div className={`${stat.color} h-2`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      {stat.title}
                    </h3>
                    <div className="text-[var(--dark-cyan)]">{stat.icon}</div>
                  </div>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Pilotos Brasileiros</h2>
                  <div className="space-x-4">
                    <button
                      onClick={handleUpdateStats}
                      disabled={isUpdatingStats}
                      className={`px-4 py-2 rounded-md text-white ${
                        isUpdatingStats
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-[var(--gamboge)] hover:bg-[var(--gamboge)]/80"
                      }`}
                    >
                      <div className="flex items-center">
                        <IconAward className="w-4 h-4 mr-2" />
                        {isUpdatingStats
                          ? "Atualizando..."
                          : "Atualizar Pódios"}
                      </div>
                    </button>
                    <button
                      onClick={handleCreateUsers}
                      disabled={isCreatingUsers}
                      className={`px-4 py-2 rounded-md text-white ${
                        isCreatingUsers
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-[var(--dark-cyan)] hover:bg-[var(--dark-cyan)]/80"
                      }`}
                    >
                      {isCreatingUsers
                        ? "Criando usuários..."
                        : "Criar Usuários"}
                    </button>
                  </div>
                </div>
                {creationStatus && (
                  <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                    {creationStatus}
                  </div>
                )}
                {updateStatus && (
                  <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                    {updateStatus}
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-[var(--card-border)]">
                        <th className="text-left py-3 px-4">Piloto</th>
                        <th className="text-left py-3 px-4">Nacionalidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {brazilianResults.map((result) => (
                        <tr
                          key={result.id}
                          className="border-b border-[var(--card-border)] hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="py-3 px-4">
                            {result.real_name || result.user_name}
                          </td>
                          <td className="py-3 px-4">{result.nationality}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "rallies" && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Gerenciar Rallies</h1>
          <RallyForm />
        </div>
      )}
    </div>
  );
}
