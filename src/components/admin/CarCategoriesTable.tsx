'use client'

import React, { useState, useMemo } from 'react';
import { RsfCarCategory } from '@/types/championship';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { IconEdit, IconCar, IconTrash } from '@tabler/icons-react';
import { formatDatabaseDate } from '@/lib/utils';
import { deleteCarCategory, isCarCategoryInUse } from '@/lib/carCategoryDB';

interface CarCategoriesTableProps {
  categories: RsfCarCategory[];
  onEdit: (categoryId: number) => void;
  onCategoryDeleted?: () => void;
  className?: string;
}

const ITEMS_PER_PAGE = 10;

export function CarCategoriesTable({ categories, onEdit, onCategoryDeleted, className }: CarCategoriesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { paginatedData, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = categories.slice(startIndex, endIndex);
    const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
    
    return { paginatedData, totalPages };
  }, [categories, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (category: RsfCarCategory) => {
    try {
      // Verifica se a categoria está sendo usada
      const inUse = await isCarCategoryInUse(category.id);
      
      if (inUse) {
        alert(`A categoria "${category.name}" não pode ser deletada pois está sendo usada por carros ou resultados de rally.`);
        return;
      }

      if (!confirm(`Tem certeza que deseja deletar a categoria "${category.name}"?`)) {
        return;
      }

      setDeletingId(category.id);
      await deleteCarCategory(category.id);
      
      onCategoryDeleted?.();
    } catch (error) {
      alert(`Erro ao deletar categoria: ${error}`);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '-';
    
    try {
      // Se for string, tenta criar um Date
      if (typeof dateString === 'string') {
        // Se for um timestamp ISO ou formato do banco
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return '-';
        }
        return formatDatabaseDate(date.toISOString().split('T')[0]);
      }
      
      // Se for Date, converte para string no formato YYYY-MM-DD
      return formatDatabaseDate(dateString.toISOString().split('T')[0]);
    } catch (error) {
      console.error('Erro ao formatar data:', error, dateString);
      return '-';
    }
  };

  if (categories.length === 0) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-8 text-center">
        <IconCar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Nenhuma categoria encontrada
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Crie sua primeira categoria de carro para começar.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--card-border)]">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Categorias de Carros ({categories.length})
          </h3>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">
                  {category.name}
                </TableCell>
                <TableCell>
                  {category.description || '-'}
                </TableCell>
                <TableCell>
                  {formatDate(category.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(category.id)}
                    >
                      <IconEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category)}
                      disabled={deletingId === category.id}
                    >
                      {deletingId === category.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                      ) : (
                        <IconTrash className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}