'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRsfOnlineRally } from '../hooks/useRsfOnlineRally';
// import type { RsfOnlineRally } from '../types/supabase';

export default function RallyList() {
  // Estado para o formulário de adição de rally
  const [newRally, setNewRally] = useState({
    rally_name: '',
    rally_id: 0
  });

  // Usando o hook com ordenação por rally_name em ordem ascendente
  const {
    rallies,
    loading,
    error,
    fetchRallies
  } = useRsfOnlineRally();

  const options = useMemo(() => ({
      limit: 5,
      orderBy: {
        column: 'created_at',
        ascending: false
      }
    }), []);

  useEffect(() => {
      fetchRallies(options);
    }, [fetchRallies, options]);

  // Manipulador para adicionar um novo rally
  // const handleAddRally = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     await addRally({
  //       rally_name: newRally.rally_name,
  //       rally_id: newRally.rally_id
  //     });
  //     // Limpa o formulário após adicionar
  //     setNewRally({ rally_name: '', rally_id: 0 });
  //   } catch (err) {
  //     console.error('Erro ao adicionar rally:', err);
  //   }
  // };

  // // Manipulador para excluir um rally
  // const handleDeleteRally = async (id: string) => {
  //   if (window.confirm('Tem certeza que deseja excluir este rally?')) {
  //     try {
  //       await deleteRally(id);
  //     } catch (err) {
  //       console.error('Erro ao excluir rally:', err);
  //     }
  //   }
  // };

  if (loading) return <div className="p-4">Carregando rallies...</div>;
  if (error) return <div className="p-4 text-red-500">Erro: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Rallies Online</h1>
      
      {/* Formulário para adicionar novo rally */}
      <form onSubmit={() => {}} className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Adicionar Novo Rally</h2>
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Nome do Rally"
            value={newRally.rally_name}
            onChange={(e) => setNewRally({ ...newRally, rally_name: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="ID do Rally"
            value={newRally.rally_id || ''}
            onChange={(e) => setNewRally({ ...newRally, rally_id: parseInt(e.target.value) || 0 })}
            className="p-2 border rounded"
            required
          />
          <button 
            type="submit" 
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Adicionar Rally
          </button>
        </div>
      </form>

      {/* Botão para recarregar dados */}
      <button 
        onClick={() => {}} 
        className="mb-4 p-2 text-black bg-gray-200 rounded hover:bg-gray-300"
      >
        Atualizar Lista
      </button>

      {rallies.length === 0 ? (
        <p>Nenhum rally encontrado.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {rallies.map((rally) => (
            <div key={rally.id} className="border rounded p-4 shadow-sm">
              <h3 className="font-bold text-lg">{rally.rally_name}</h3>
              <p>ID do Rally: {rally.rally_id}</p>
              <p className="text-sm text-gray-500">
                Criado em: {new Date(rally.created_at).toLocaleString()}
              </p>
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => {}}
                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}