"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";

interface ChampionshipResult {
  id: string;
  position: number;
  userid: number;
  user_name: string;
  real_name: string;
  nationality: string;
  car?: string;
  time3?: string;
  super_rally?: string;
  penalty?: string;
  points: number;
  created_at: string;
}

interface CustomChampionshipResultsProps {
  championshipId: string;
}

export default function CustomChampionshipResults({
  championshipId,
}: CustomChampionshipResultsProps) {
  const [results, setResults] = useState<ChampionshipResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/championships/${championshipId}/results`
        );
        if (!response.ok) throw new Error("Erro ao carregar resultados");
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError("Erro ao carregar resultados");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [championshipId]);

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

  const top3 = results.slice(0, 3);
  // const otherResults = results.slice(3);

  return (
    <div>
      {/* Pódio */}
      {top3.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Pódio
          </h2>
          <div className="flex justify-center items-end space-x-4 mb-8">
            {/* 2º Lugar */}
            {top3[1] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="bg-gray-600 rounded-lg p-4 h-32 flex flex-col justify-end border border-gray-500">
                  <Image
                    src="/trofeu-2.png"
                    alt="2º lugar"
                    width={40}
                    height={40}
                    className="mx-auto mb-2"
                  />
                  <span className="text-2xl font-bold text-gray-200">2º</span>
                </div>
                <div className="mt-4">
                  <ReactCountryFlag
                    countryCode={top3[1].nationality}
                    svg
                    className="w-6 h-4 mb-2"
                  />
                  <p className="font-semibold text-white">
                    {top3[1].user_name}
                  </p>
                  <p className="text-sm text-gray-400">{top3[1].points} pts</p>
                </div>
              </motion.div>
            )}

            {/* 1º Lugar */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-yellow-400 rounded-lg p-4 h-40 flex flex-col justify-end border border-yellow-300">
                <Image
                  src="/trofeu-1.png"
                  alt="1º lugar"
                  width={50}
                  height={50}
                  className="mx-auto mb-2"
                />
                <span className="text-3xl font-bold text-yellow-800">1º</span>
              </div>
              <div className="mt-4">
                <ReactCountryFlag
                  countryCode={top3[0].nationality}
                  svg
                  className="w-6 h-4 mb-2"
                />
                <p className="font-semibold text-white">{top3[0].user_name}</p>
                <p className="text-sm text-gray-400">{top3[0].points} pts</p>
              </div>
            </motion.div>

            {/* 3º Lugar */}
            {top3[2] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="bg-orange-400 rounded-lg p-4 h-24 flex flex-col justify-end border border-orange-300">
                  <Image
                    src="/trofeu-3.png"
                    alt="3º lugar"
                    width={35}
                    height={35}
                    className="mx-auto mb-2"
                  />
                  <span className="text-xl font-bold text-orange-800">3º</span>
                </div>
                <div className="mt-4">
                  <ReactCountryFlag
                    countryCode={top3[2].nationality}
                    svg
                    className="w-6 h-4 mb-2"
                  />
                  <p className="font-semibold text-white">
                    {top3[2].user_name}
                  </p>
                  <p className="text-sm text-gray-400">{top3[2].points} pts</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Tabela de Resultados */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <div className="bg-[#140f15] text-white p-4">
          <h3 className="text-xl font-bold">Resultados Completos</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Pos
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Piloto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  País
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Carro
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tempo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Pontos
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {results.map((result, index) => (
                <motion.tr
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-700"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        result.position === 1
                          ? "bg-yellow-100 text-yellow-800"
                          : result.position === 2
                          ? "bg-gray-100 text-gray-800"
                          : result.position === 3
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-600 text-gray-200"
                      }`}
                    >
                      {result.position}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {result.user_name}
                    </div>
                    {result.real_name && (
                      <div className="text-sm text-gray-400">
                        {result.real_name}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <ReactCountryFlag
                      countryCode={result.nationality}
                      svg
                      className="w-6 h-4"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {result.car || "-"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {result.time3 || "-"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {result.points}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
