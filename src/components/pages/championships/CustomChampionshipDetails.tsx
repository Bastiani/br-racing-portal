"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IconArrowLeft, IconTrophy, IconList } from "@tabler/icons-react";
import CustomChampionshipResults from "./CustomChampionshipResults";

interface CustomChampionship {
  id: string;
  championship_name: string;
  rally_id: number;
  created_at: string;
}

type TabType = "standings" | "results";

export default function CustomChampionshipDetails() {
  const params = useParams();
  const router = useRouter();
  const championshipId = params?.id as string;

  const [championship, setChampionship] = useState<CustomChampionship | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<TabType>("standings");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChampionship = async () => {
      try {
        const response = await fetch(
          `/api/custom-championships/${championshipId}`
        );
        if (!response.ok) throw new Error("Campeonato não encontrado");
        const data = await response.json();
        setChampionship(data);
      } catch (err) {
        setError("Erro ao carregar campeonato");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (championshipId) {
      fetchChampionship();
    }
  }, [championshipId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !championship) {
    return (
      <div className="text-center p-8">
        <p className="text-red-400 mb-4">
          {error || "Campeonato não encontrado"}
        </p>
        <button
          onClick={() => router.push("/custom-championships")}
          className="bg-[#140f15] text-white px-4 py-2 rounded-lg hover:bg-[#2a1f2b] transition-colors"
        >
          Voltar aos Campeonatos
        </button>
      </div>
    );
  }

  const tabs = [
    { id: "standings" as TabType, label: "Classificação", icon: IconTrophy },
    { id: "results" as TabType, label: "Resultados", icon: IconList },
  ];

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/custom-championships")}
          className="flex items-center text-white hover:text-gray-300 transition-colors mb-4"
        >
          <IconArrowLeft size={20} className="mr-2" />
          Voltar aos Campeonatos
        </button>

        <div className="bg-gradient-to-r from-[#140f15] to-[#2a1f2b] rounded-lg p-6 text-white border border-gray-700">
          <h1 className="text-3xl font-bold mb-2">
            {championship.championship_name}
          </h1>
          <p className="opacity-90">
            Rally #{championship.rally_id} • Criado em{" "}
            {new Date(championship.created_at).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-white text-white"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                  }`}
                >
                  <Icon size={18} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "standings" && (
          // <ChampionshipStandings championshipId={championshipId} />
          <div>
            <p>Classificação</p>
          </div>
        )}
        {activeTab === "results" && (
          <CustomChampionshipResults championshipId={championshipId} />
        )}
      </motion.div>
    </div>
  );
}
