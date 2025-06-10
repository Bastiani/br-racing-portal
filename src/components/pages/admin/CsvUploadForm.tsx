"use client";

import { useState } from "react";
import {
  IconUpload,
  IconFileText,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { parseCSV } from "@/utils/parseCSV";
import { CsvResult } from "@/types/championship";

interface CsvUploadFormProps {
  onUploadSuccess?: () => void;
}

interface CsvRow {
  position: string;
  userid: string;
  user_name: string;
  real_name: string;
  nationality: string;
  car: string;
  time3: string;
  super_rally: string;
  penalty: string;
}

export default function CsvUploadForm({ onUploadSuccess }: CsvUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [championshipId, setChampionshipId] = useState("");
  const [extractedRsfRallyId, setExtractedRsfRallyId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<CsvResult[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      // Extrair rsf_rally_id do nome do arquivo
      const fileName = selectedFile.name;
      const match = fileName.match(/^(\d+)_/);
      if (match) {
        const rsfRallyId = parseInt(match[1]);
        setExtractedRsfRallyId(rsfRallyId);
      } else {
        setExtractedRsfRallyId(null);
        setError(
          "Nome do arquivo deve começar com números seguidos de underscore (ex: 123_rally.csv)"
        );
      }
      parseCsvFile(selectedFile);
    } else {
      setError("Por favor, selecione um arquivo CSV válido.");
      setFile(null);
    }
  };

  const parseCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());

      const data: CsvRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(",").map((v) => v.trim());
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || "";
          });
          data.push(row);
        }
      }
      setCsvData(parseCSV(data, championshipId, extractedRsfRallyId));
      setShowPreview(true);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !championshipId || csvData.length === 0) {
      setError(
        "Por favor, selecione um arquivo CSV e informe o ID do campeonato."
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/championships/${championshipId}/results`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(csvData),
        }
      );

      if (response.ok) {
        setSuccess("Resultados importados com sucesso!");
        setFile(null);
        setChampionshipId("");
        setCsvData([]);
        setShowPreview(false);
        onUploadSuccess?.();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erro ao importar resultados");
      }
    } catch (error) {
      setError("Erro ao importar resultados. Tente novamente.");
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <IconUpload className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          Upload de Resultados CSV
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="championshipId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            ID do Campeonato
          </label>
          <input
            type="text"
            id="championshipId"
            value={championshipId}
            onChange={(e) => setChampionshipId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite o ID do campeonato"
            required
          />
        </div>

        <div>
          <label
            htmlFor="csvFile"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Arquivo CSV
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
            <div className="space-y-1 text-center">
              <IconFileText className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="csvFile"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Selecione um arquivo</span>
                  <input
                    id="csvFile"
                    name="csvFile"
                    type="file"
                    accept=".csv"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">ou arraste e solte</p>
              </div>
              <p className="text-xs text-gray-500">CSV até 10MB</p>
            </div>
          </div>
          {file && (
            <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
              <IconCheck className="w-4 h-4" />
              {file.name}
            </p>
          )}
        </div>

        {showPreview && csvData.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Prévia dos Dados ({csvData.length} registros)
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posição
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome Real
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nacionalidade
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carro
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {csvData.slice(0, 5).map((row, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {row.position}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {row.user_name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {row.real_name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {row.nationality}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {row.car}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {csvData.length > 5 && (
                <p className="text-sm text-gray-500 mt-2">
                  ... e mais {csvData.length - 5} registros
                </p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <IconX className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <IconCheck className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-sm text-green-600">{success}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !file || !championshipId}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Importando...
              </>
            ) : (
              <>
                <IconUpload className="w-4 h-4 mr-2" />
                Importar Resultados
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          Formato esperado do CSV:
        </h4>
        <p className="text-sm text-blue-700">
          O arquivo deve conter as colunas: position, userid, user_name,
          real_name, nationality, car, time3, super_rally, penalty
        </p>
      </div>
    </div>
  );
}
