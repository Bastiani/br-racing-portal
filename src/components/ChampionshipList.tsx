"use client";
import { useEffect, useMemo, useState } from "react";
import { useRsfOnlineRally } from "@/hooks/useRsfOnlineRally";
import { useRallyResults } from "@/hooks/useRallyResults";
import { RallyResults } from "./RallyResults";

export function ChampionshipList() {
  const [selectedRally, setSelectedRally] = useState<string | null>(null);
  const options = useMemo(
    () => ({
      limit: 5,
      orderBy: {
        column: "created_at",
        ascending: false,
      },
    }),
    []
  );

  const { rallies, loading, error, fetchRallies } = useRsfOnlineRally();
  const {
    results,
    loading: loadingResults,
    error: resultsError,
    fetchResults,
  } = useRallyResults();

  useEffect(() => {
    fetchRallies(options);
  }, [fetchRallies, options]);

  useEffect(() => {
    if (selectedRally) {
      fetchResults(selectedRally);
    }
  }, [fetchResults, selectedRally]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#140f15]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Erro ao carregar campeonatos: {error.message}
      </div>
    );
  }

  return (
    <section id="championships" className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#140f15] mb-8">
          Últimos Campeonatos
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#140f15] shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-[#ff6b00] text-white">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Nome</th>
                <th className="px-6 py-4 text-left font-bold">
                  Data de Criação
                </th>
                <th className="px-6 py-4 text-left font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {rallies?.map((rally) => (
                <tr
                  key={rally.id}
                  className="text-white hover:bg-[#ff6b00]/10 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{rally.rally_name}</td>
                  <td className="px-6 py-4">
                    {new Date(rally.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedRally(rally.id)}
                      className="bg-[#ff6b00] text-white px-4 py-2 rounded hover:bg-[#ff6b00]/80 transition-colors"
                    >
                      Ver Resultados
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedRally && (
          <RallyResults
            results={results}
            loading={loadingResults}
            error={resultsError}
            onClose={() => setSelectedRally(null)}
          />
        )}
      </div>
    </section>
  );
}
