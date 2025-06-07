"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IconTrophy, IconCalendar } from "@tabler/icons-react";
import WRCPointsTable from "./WRCPointsTable";

interface CustomChampionship {
  id: string;
  championship_name: string;
  rally_id: number;
  created_at: string;
}

export default function CustomChampionshipsList() {
  const [championships, setChampionships] = useState<CustomChampionship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChampionships = async () => {
      try {
        const response = await fetch("/api/custom-championships");
        if (!response.ok) throw new Error("Erro ao carregar campeonatos");
        const data = await response.json();
        setChampionships(data);
      } catch (err) {
        setError("Erro ao carregar campeonatos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChampionships();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Campeonatos</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Explore os campeonatos e acompanhe os resultados e classificações.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
        {championships.map((championship, index) => (
          <motion.div
            key={championship.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-700"
          >
            <div className="bg-gradient-to-r from-[#140f15] to-[#2a1f2b] p-6">
              <div className="flex items-center justify-between">
                <IconTrophy className="text-yellow-400" size={32} />
                <span className="text-white text-sm opacity-75">
                  Rally #{championship.rally_id}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">
                {championship.championship_name}
              </h3>

              <div className="flex items-center text-gray-400 mb-4">
                <IconCalendar size={16} className="mr-2" />
                <span className="text-sm">
                  {new Date(championship.created_at).toLocaleDateString(
                    "pt-BR"
                  )}
                </span>
              </div>

              <Link
                href={`/custom-championships/${championship.id}`}
                className="inline-block w-full bg-[#140f15] text-white text-center py-2 px-4 rounded-lg hover:bg-[#2a1f2b] transition-colors"
              >
                Ver Detalhes
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      <WRCPointsTable />

      {championships.length === 0 && (
        <div className="text-center py-12">
          <IconTrophy size={64} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            Nenhum campeonato encontrado
          </h3>
          <p className="text-gray-400">
            Não há campeonatos customizados disponíveis no momento.
          </p>
        </div>
      )}
    </section>
  );
}
