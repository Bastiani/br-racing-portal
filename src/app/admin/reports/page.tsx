import { FiDownload, FiEye, FiTrash2 } from 'react-icons/fi';

export default function ReportsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Relatu00f3rios</h1>
      
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Gerar Novo Relatu00f3rio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Relatu00f3rio</label>
              <select className="w-full border border-[var(--card-border)] bg-[var(--background)] rounded-md px-3 py-2">
                <option>Vendas</option>
                <option>Usuu00e1rios</option>
                <option>Atividades</option>
                <option>Financeiro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data Inicial</label>
              <input type="date" className="w-full border border-[var(--card-border)] bg-[var(--background)] rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data Final</label>
              <input type="date" className="w-full border border-[var(--card-border)] bg-[var(--background)] rounded-md px-3 py-2" />
            </div>
          </div>
          <button className="bg-[var(--dark-cyan)] hover:bg-[var(--midnight-green)] text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2">
            <FiDownload className="w-4 h-4" />
            <span>Gerar Relatu00f3rio</span>
          </button>
        </div>
      </div>
      
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Relatu00f3rios Recentes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--card-border)]">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Criado por</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Au00e7u00f5es</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--card-border)]">
                {[
                  { name: 'Relatu00f3rio de Vendas Q1', type: 'Vendas', date: '15/04/2023', creator: 'Jou00e3o Silva' },
                  { name: 'Atividades Mensais', type: 'Atividades', date: '01/05/2023', creator: 'Maria Oliveira' },
                  { name: 'Relatu00f3rio Financeiro', type: 'Financeiro', date: '10/05/2023', creator: 'Pedro Santos' },
                  { name: 'Novos Usuu00e1rios', type: 'Usuu00e1rios', date: '22/05/2023', creator: 'Ana Costa' },
                ].map((report, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{report.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{report.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{report.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{report.creator}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <button className="text-[var(--dark-cyan)] hover:text-[var(--midnight-green)] mr-3 flex items-center gap-1">
                        <FiEye className="w-4 h-4" />
                        <span>Visualizar</span>
                      </button>
                      <button className="text-[var(--auburn)] hover:text-[var(--rufous)] flex items-center gap-1">
                        <FiTrash2 className="w-4 h-4" />
                        <span>Excluir</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}