"use client";

import { IconFlag, IconAward } from "@tabler/icons-react";
import {
  getFourFanBrazilianResults,
  createRsfUser,
  updateDriverPodiumStats,
} from "@/lib/fourFanDB";
import { useEffect, useState } from "react";
import { RsfResult } from "@/types";
import ChampionshipCreateForm from "@/components/forms/ChampionshipCreateForm";
import ChampionshipEditForm from "@/components/forms/ChampionshipEditForm";
import RallyCreateForm from "@/components/forms/RallyCreateForm";
import ChampionshipImportForm from "@/components/forms/ChampionshipImportForm";
import { getAllChampionships } from "@/lib/championshipDB";
import { RsfChampionship } from "@/types/championship";
import { Button } from "@/components/ui/button";
import { AdminFormsProvider, useAdminForms } from "@/contexts/AdminFormsContext";
import RallyForm from "@/components/pages/admin/RallyForm";

function AdminDashboardContent() {
  const [brazilianResults, setBrazilianResults] = useState<RsfResult[]>([]);
  const [isCreatingUsers, setIsCreatingUsers] = useState(false);
  const [isUpdatingStats, setIsUpdatingStats] = useState(false);
  const [creationStatus, setCreationStatus] = useState<string>("");
  const [updateStatus, setUpdateStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "rallies" | "championship" | "edit-championship">(
    "dashboard"
  );
  const [championships, setChampionships] = useState<RsfChampionship[]>([]);
  
  // Usar o contexto para gerenciar estado dos formulários
  const {
    currentStep,
    editingChampionshipId,
    setEditingChampionshipId,
    resetFlow,
    goToImportExisting
  } = useAdminForms();

  // As funções de callback agora são gerenciadas pelo contexto

  // Função para carregar campeonatos
  const loadChampionships = async () => {
    try {
      const data = await getAllChampionships();
      setChampionships(data);
    } catch (error) {
      console.error('Erro ao carregar campeonatos:', error);
    }
  };

  // Função para iniciar edição de campeonato
  const handleEditChampionship = (championshipId: number) => {
    setEditingChampionshipId(championshipId);
    setActiveTab('edit-championship');
  };

  // Função para cancelar edição
  const handleCancelEdit = () => {
    setEditingChampionshipId(undefined);
    setActiveTab('championship');
  };

  // Função para sucesso na edição
  const handleEditSuccess = () => {
    setEditingChampionshipId(undefined);
    setActiveTab('championship');
    loadChampionships(); // Recarregar lista
  };

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
    loadChampionships();
  }, []);

  // Carregar campeonatos quando a aba de campeonato for ativada
  useEffect(() => {
    if (activeTab === 'championship') {
      loadChampionships();
    }
  }, [activeTab]);

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
            name: (result.real_name || result.user_name) ?? '',
            nationality: result.nationality ?? '',
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
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`pb-2 px-4 ${
            activeTab === "dashboard"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("rallies")}
          className={`pb-2 px-4 ${
            activeTab === "rallies"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Rallies
        </button>
        <button
          onClick={() => setActiveTab("championship")}
          className={`pb-2 px-4 ${
            activeTab === "championship"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Campeonato
        </button>
        {editingChampionshipId && (
          <button
            onClick={() => setActiveTab("edit-championship")}
            className={`pb-2 px-4 ${
              activeTab === "edit-championship"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Editar Campeonato
          </button>
        )}
      </div>

      {/* Conteúdo das abas */}
      {activeTab === "edit-championship" && editingChampionshipId && (
        <div>
          <ChampionshipEditForm 
            championshipId={editingChampionshipId}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
          />
        </div>
      )}

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

      {activeTab === "championship" && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Gerenciar Campeonato</h1>

          {/* Lista de campeonatos existentes */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Campeonatos Existentes</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {championships.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {championships.map((championship) => (
                    <div key={championship.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{championship.name}</h3>
                        <p className="text-sm text-gray-500">
                          Temporada: {championship.season} | Status: 
                          <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                            championship.status === 'active' ? 'bg-green-100 text-green-800' :
                            championship.status === 'finished' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {championship.status === 'active' ? 'Ativo' :
                             championship.status === 'finished' ? 'Finalizado' : 'Cancelado'}
                          </span>
                        </p>
                        {championship.start_date && (
                          <p className="text-sm text-gray-500">
                            Início: {new Date(championship.start_date).toLocaleDateString('pt-BR')}
                            {championship.end_date && (
                              <> | Fim: {new Date(championship.end_date).toLocaleDateString('pt-BR')}</>
                            )}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleEditChampionship(championship.id)}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Editar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Nenhum campeonato encontrado
                </div>
              )}
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Gestão de Campeonato</h2>
            <div className="flex gap-2">
              <Button onClick={goToImportExisting} variant="outline">
                Importar em Campeonato Existente
              </Button>
              <Button onClick={resetFlow} variant="outline">
                Reiniciar Fluxo
              </Button>
            </div>
          </div>

          {/* Indicador de progresso - ajustar para mostrar quando está no modo de importação direta */}
          <div className="flex items-center space-x-4 mb-8">
            <div className={`flex items-center space-x-2 ${
              currentStep === 'championship' ? 'text-blue-600' : 
              currentStep === 'rally' || currentStep === 'import' ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'championship' ? 'bg-blue-600 text-white' : 
                currentStep === 'rally' || currentStep === 'import' ? 'bg-green-600 text-white' : 'bg-gray-300'
              }`}>
                1
              </div>
              <span>Campeonato</span>
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${
              currentStep === 'rally' ? 'text-blue-600' : 
              currentStep === 'import' ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'rally' ? 'bg-blue-600 text-white' : 
                currentStep === 'import' ? 'bg-green-600 text-white' : 'bg-gray-300'
              }`}>
                2
              </div>
              <span>Rally</span>
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${
              currentStep === 'import' ? 'text-blue-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'import' ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}>
                3
              </div>
              <span>Importar CSV</span>
            </div>
          </div>

          {/* Conteúdo baseado no step atual */}
          {currentStep === 'championship' && (
            <ChampionshipCreateForm />
          )}

          {currentStep === 'rally' && (
            <RallyCreateForm />
          )}

          {currentStep === 'import' && (
            <ChampionshipImportForm />
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminFormsProvider>
      <AdminDashboardContent />
    </AdminFormsProvider>
  );
}
