'use client';

import React, { useState, useMemo } from 'react';
import { RsfChampionship } from '@/types/championship';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { IconEdit, IconCalendar, IconTrophy } from '@tabler/icons-react';
import { formatDatabaseDate } from '@/lib/utils';

interface ChampionshipsTableProps {
  championships: RsfChampionship[];
  onEdit: (championshipId: number) => void;
  className?: string;
}

const ITEMS_PER_PAGE = 5;

export function ChampionshipsTable({ championships, onEdit, className }: ChampionshipsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const { paginatedData, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = championships.slice(startIndex, endIndex);
    const totalPages = Math.ceil(championships.length / ITEMS_PER_PAGE);
    
    return { paginatedData, totalPages };
  }, [championships, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      finished: { label: 'Finalizado', className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
      cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.cancelled;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return formatDatabaseDate(dateString);
  };

  if (championships.length === 0) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-8 text-center">
        <IconTrophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Nenhum campeonato encontrado
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Crie seu primeiro campeonato para começar.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--card-border)]">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Campeonatos ({championships.length})
          </h3>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Nome</TableHead>
              <TableHead className="w-[100px]">Temporada</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[120px]">Data Início</TableHead>
              <TableHead className="w-[120px]">Data Fim</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((championship) => (
              <TableRow key={championship.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <IconTrophy className="h-4 w-4 text-[var(--gamboge)]" />
                    <span>{championship.name}</span>
                  </div>
                </TableCell>
                <TableCell>{championship.season}</TableCell>
                <TableCell>{getStatusBadge(championship.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <IconCalendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(championship.start_date?.toString() ?? null)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <IconCalendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(championship.end_date?.toString() ?? null)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(championship.id)}
                    className="h-8"
                  >
                    <IconEdit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[var(--card-border)]">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChampionshipsTable;