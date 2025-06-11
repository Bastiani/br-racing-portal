"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFourFanRallyResults } from "@/hooks/useFourFanRallyResults";
import { RsfResult } from "@/types";
import ReactCountryFlag from "react-country-flag";
import { motion } from "framer-motion";
import Image from "next/image";

export default function FourFanResults() {
  const params = useParams();
  const router = useRouter();
  const rallyId = params?.id as string;

  const { results, loading, error, fetchResults } = useFourFanRallyResults();

  useEffect(() => {
    if (rallyId) {
      fetchResults(rallyId);
    }
  }, [fetchResults, rallyId]);

  const top3 = results?.slice(0, 3) || [];
  const moreResults = results?.slice(3) || [];

  return (
    <section id="fourFanResult">
      <h1 className="text-4xl font-bold text-[#E0E1DD] mb-8 mt-8">
        Resultados do 4FUN
      </h1>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#140f15]"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4">
          Erro ao carregar resultados: {error.message}
        </div>
      ) : results && results.length > 0 ? (
        <>
          {/* Top 3 destaques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {top3.map((result: RsfResult, index) => (
              <motion.div
                key={result.id}
                className={`p-6 rounded-2xl shadow-xl text-[#140f15] ${
                  index === 0
                    ? "bg-gradient-to-r from-amber-200 to-yellow-500 border-2 border-[#E0E1DD] drop-shadow-xl"
                    : index === 1
                    ? "bg-gradient-to-r from-slate-300 to-slate-500 border-2 border-[#E0E1DD] drop-shadow-xl"
                    : "bg-gradient-to-r from-orange-300 to-orange-500 border-2 border-[#E0E1DD] drop-shadow-xl"
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="mb-4">
                  {index === 0 && (
                    <Image
                      src="/trofeu-1.png" // caminho da imagem
                      alt="1º Lugar"
                      className="w-20 h-20 mx-auto"
                      width={64}
                      height={64}
                    />
                  )}
                  {index === 1 && (
                    <Image
                      src="/trofeu-2.png"
                      alt="2º Lugar"
                      className="w-20 h-20 mx-auto"
                      width={64}
                      height={64}
                    />
                  )}
                  {index === 2 && (
                    <Image
                      src="/trofeu-3.png"
                      alt="3º Lugar"
                      className="w-20 h-20 mx-auto"
                      width={64}
                      height={64}
                    />
                  )}
                </div>

                <h2 className=" text-xl font-bold mb-2">
                  {result.real_name || result.user_name}
                </h2>
                <div className="flex items-center gap-2 mb-2">
                  <ReactCountryFlag
                    countryCode={result.nationality || 'BR'}
                    svg
                    style={{ width: "2em", height: "2em" }}
                    title={result.nationality}
                  />
                  <span>{result.nationality}</span>
                </div>
                <p className="font-medium">Carro: {result.car}</p>
                <p>Tempo: {result.time3}</p>
                <p>Penalidade: {result.penalty}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabela com o restante */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#0D1B2A] shadow-lg rounded-lg overflow-hidden mb-8">
              <thead className="bg-[#ff6b00] text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Posição</th>
                  <th className="px-6 py-4 text-left font-bold">Piloto</th>
                  <th className="px-6 py-4 text-left font-bold">
                    Nacionalidade
                  </th>
                  <th className="px-6 py-4 text-left font-bold">Carro</th>
                  <th className="px-6 py-4 text-left font-bold">Tempo</th>
                  <th className="px-6 py-4 text-left font-bold">Super Rally</th>
                  <th className="px-6 py-4 text-left font-bold">Penalidade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {moreResults.map((result: RsfResult) => (
                  <tr
                    key={result.id}
                    className="text-white hover:bg-[#ff6b00]/10 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-2">
                      {result.position}
                    </td>
                    <td className="px-6 py-4">
                      {result.real_name || result.user_name}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <ReactCountryFlag
                        countryCode={result.nationality || 'BR'}
                        svg
                        style={{
                          width: "1.5em",
                          height: "1.5em",
                        }}
                        title={result.nationality}
                      />
                      {result.nationality}
                    </td>
                    <td className="px-6 py-4">{result.car}</td>
                    <td className="px-6 py-4">{result.time3}</td>
                    <td className="px-6 py-4">{result.super_rally}</td>
                    <td className="px-6 py-4">{result.penalty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-gray-500 p-4">Nenhum resultado encontrado.</div>
      )}

      <button
        onClick={() => router.push("/fourFan")}
        className="h-8 w-28 mb-8 text-sm bg-orange-700/80 text-white px-3 py-1 rounded hover:bg-[#ff6b00] cursor-pointer transition-colors"
      >
        Voltar
      </button>
    </section>
  );
}
