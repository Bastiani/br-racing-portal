'use client';

import React, { useState, useMemo } from 'react';
import { RsfRally } from '@/types/championship';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { IconEdit, IconCalendar, IconFlag, IconMapPin } from '@tabler/icons-react';
import { formatDatabaseDate } from '@/lib/utils';

interface RalliesTableProps {
  rallies: RsfRally[];
  onEdit: (rallyId: number) => void;
  className?: string;
}

const ITEMS_PER_PAGE = 5;

export function RalliesTable({ rallies, onEdit, className }: RalliesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const { paginatedData, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = rallies.slice(startIndex, endIndex);
    const totalPages = Math.ceil(rallies.length / ITEMS_PER_PAGE);
    
    return { paginatedData, totalPages };
  }, [rallies, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return formatDatabaseDate(dateString);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'Agendado', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      ongoing: { label: 'Em Andamento', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      finished: { label: 'Finalizado', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (rallies.length === 0) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-8 text-center">
        <IconFlag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Nenhum rally encontrado
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Crie seu primeiro rally para começar.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--card-border)]">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Rallies ({rallies.length})
          </h3>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Nome</TableHead>
              <TableHead className="w-[120px]">Campeonato</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[120px]">Data</TableHead>
              <TableHead className="w-[150px]">Local</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((rally) => (
              <TableRow key={rally.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <IconFlag className="h-4 w-4 text-[var(--dark-cyan)]" />
                    <span>{rally.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {rally.championship_id ? (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ID: {rally.championship_id}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {rally.status ? getStatusBadge(rally.status) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <IconCalendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(rally.rally_date?.toString())}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {rally.location ? (
                    <div className="flex items-center space-x-1">
                      <IconMapPin className="h-4 w-4 text-gray-400" />
                      <span className="truncate" title={rally.location}>
                        {rally.location}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(rally.id)}
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

export default RalliesTable;