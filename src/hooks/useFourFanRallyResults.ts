import { useState, useCallback } from "react";
import { RsfResult } from "@/types";

export function useFourFanRallyResults() {
  const [results, setResults] = useState<RsfResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchResults = useCallback(async (rallyId: string) => {
    setLoading(true);
    setError(null);
    console.log("Fetching rally results...", rallyId);

    try {
      const response = await fetch(`/api/fourfanrallies/${rallyId}/results`);
      if (!response.ok) {
        throw new Error("Falha ao buscar resultados");
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Sem dependências.

  return {
    results,
    loading,
    error,
    fetchResults,
  };
}
