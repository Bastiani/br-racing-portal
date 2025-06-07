"use client";

import { useEffect, useState } from "react";
import { ChampionshipSummary } from "@/types/championship";
import ReactCountryFlag from "react-country-flag";
import { motion } from "framer-motion";

interface ChampionshipStandingsProps {
  championshipId?: string;
  showPointsHistory?: boolean;
}

export default function ChampionshipStandings({
  championshipId,
}: ChampionshipStandingsProps) {
  const [standings, setStandings] = useState<ChampionshipSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        // const data = await getChampionshipStandings(championshipId);
        // setStandings(data);
      } catch (err) {
        setError("Erro ao carregar classificação");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [championshipId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#140f15]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-[#140f15] text-white p-4">
        <h2 className="text-2xl font-bold">Classificação do Campeonato</h2>
        <p className="text-gray-300">Sistema de Pontuação WRC (sem bônus)</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pos.
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Piloto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                País
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pontos
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {standings.map((driver, index) => (
              <motion.tr
                key={driver.user_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`hover:bg-gray-50 ${
                  index < 3 ? "bg-yellow-50" : ""
                }`}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-400"
                        : index === 2
                        ? "bg-yellow-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {driver.position_rank}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {driver.user_name}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {driver.nationality && (
                    <ReactCountryFlag
                      countryCode={driver.nationality}
                      svg
                      style={{
                        width: "1.5em",
                        height: "1.5em",
                      }}
                      title={driver.nationality}
                    />
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-lg font-bold text-[#140f15]">
                    {driver.total_points}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
