"use client";
import { RsfResult } from "@/types";
import ReactCountryFlag from "react-country-flag";

interface RallyResultsProps {
  results: RsfResult[];
  loading: boolean;
  error: Error | null;
  onClose: () => void;
}

export function RallyResults({
  results,
  loading,
  error,
  onClose,
}: RallyResultsProps) {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-[#140f15] mb-4">
        Resultados do Rally
        <button
          onClick={onClose}
          className="ml-4 text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
        >
          Fechar
        </button>
      </h3>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#140f15]"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4">
          Erro ao carregar resultados: {error.message}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#140f15] shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-[#ff6b00] text-white">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Posição</th>
                <th className="px-6 py-4 text-left font-bold">Piloto</th>
                <th className="px-6 py-4 text-left font-bold">Nacionalidade</th>
                <th className="px-6 py-4 text-left font-bold">Carro</th>
                <th className="px-6 py-4 text-left font-bold">Tempo</th>
                <th className="px-6 py-4 text-left font-bold">Super Rally</th>
                <th className="px-6 py-4 text-left font-bold">Penalidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {results.map((result) => (
                <tr
                  key={result.id}
                  className="text-white hover:bg-[#ff6b00]/10 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-2">
                    {result.position === 1 && <span title="1º Lugar">🏆</span>}
                    {result.position === 2 && <span title="2º Lugar">🥈</span>}
                    {result.position === 3 && <span title="3º Lugar">🥉</span>}
                    {result.position}
                  </td>
                  <td className="px-6 py-4">
                    {result.real_name || result.user_name}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <ReactCountryFlag
                      countryCode={result.nationality}
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
      )}
    </div>
  );
}
