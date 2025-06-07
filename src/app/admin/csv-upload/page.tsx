"use client";

import { useState } from "react";
import CsvUploadForm from "@/components/pages/admin/CsvUploadForm";
import { IconFileUpload, IconHistory } from "@tabler/icons-react";

export default function CsvUploadPage() {
  const [, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Upload de Resultados
          </h1>
          <p className="text-gray-600 mt-1">
            Importe resultados de campeonatos através de arquivos CSV
          </p>
        </div>
        <div className="flex items-center gap-2 text-blue-600">
          <IconFileUpload className="w-6 h-6" />
          <span className="font-medium">CSV Import</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CsvUploadForm onUploadSuccess={handleUploadSuccess} />
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <IconHistory className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Instruções
              </h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-800">
                  1. Prepare o arquivo CSV
                </h4>
                <p>
                  Certifique-se de que o arquivo contém todas as colunas
                  necessárias.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">
                  2. Informe o ID do campeonato
                </h4>
                <p>
                  Digite o ID do campeonato onde os resultados serão importados.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">3. Faça o upload</h4>
                <p>
                  Selecione o arquivo e clique em &quot;Importar
                  Resultados&quot;.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">
              ⚠️ Atenção
            </h4>
            <p className="text-sm text-yellow-700">
              Os resultados existentes para o mesmo campeonato e usuário serão
              atualizados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
