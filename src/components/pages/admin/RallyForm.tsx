"use client";

import { useState, useEffect } from "react";
import { RsfOnlineRally } from "@/types";

interface RallyFormProps {
  onRallyCreated?: () => void;
}

export default function RallyForm({ onRallyCreated }: RallyFormProps) {
  const [formData, setFormData] = useState({
    rally_name: "",
    rally_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [latestRallies, setLatestRallies] = useState<RsfOnlineRally[]>([]);
  const [loadingRallies, setLoadingRallies] = useState(true);

  // Buscar os últimos rallies ao carregar o componente
  useEffect(() => {
    fetchLatestRallies();
  }, []);

  const fetchLatestRallies = async () => {
    try {
      setLoadingRallies(true);
      const response = await fetch("/api/rallies");
      if (response.ok) {
        const rallies = await response.json();
        setLatestRallies(rallies);
      }
    } catch (error) {
      console.error("Erro ao buscar rallies:", error);
    } finally {
      setLoadingRallies(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/rallies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("Rally criado com sucesso!");
        setFormData({ rally_name: "", rally_id: "" });
        await fetchLatestRallies(); // Atualizar a lista
        onRallyCreated?.();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erro ao criar rally");
      }
    } catch (error) {
      setError("Erro ao criar rally. Tente novamente.");
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  return (
    <div className="space-y-8">
      {/* Formulário */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Adicionar Novo Rally
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="rally_name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Nome do Rally
            </label>
            <input
              type="text"
              id="rally_name"
              name="rally_name"
              value={formData.rally_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Digite o nome do rally"
            />
          </div>

          <div>
            <label
              htmlFor="rally_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              ID do Rally
            </label>
            <input
              type="number"
              id="rally_id"
              name="rally_id"
              value={formData.rally_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Digite o ID do rally"
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-200 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            {isLoading ? "Criando..." : "Criar Rally"}
          </button>
        </form>
      </div>

      {/* Lista dos últimos rallies */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Últimos 10 Rallies Criados
        </h3>

        {loadingRallies ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Carregando rallies...
            </p>
          </div>
        ) : latestRallies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nome do Rally
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rally ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data de Criação
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {latestRallies.map((rally) => (
                  <tr
                    key={rally.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {rally.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {rally.rally_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {rally.rally_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {rally.created_at ? formatDate(rally.created_at) : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">
            Nenhum rally encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
