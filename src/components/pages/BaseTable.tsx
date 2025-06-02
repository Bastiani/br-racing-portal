import React from 'react';

interface Column {
  header: React.ReactNode;
  className?: string;
}

interface BaseTableProps {
  columns: Column[];
  rows: React.ReactNode[][];
  tableClassName?: string;
  theadClassName?: string;
  tbodyClassName?: string;
}

export default function BaseTable({ columns, rows, tableClassName = '', theadClassName = '', tbodyClassName = '' }: BaseTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full shadow-lg rounded-lg overflow-hidden ${tableClassName}`}>
        <thead className={`bg-[#ff6b00] text-white ${theadClassName}`}>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={`px-6 py-4 text-left font-bold ${col.className || ''}`}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y divide-gray-700 ${tbodyClassName}`}>
          {rows.length > 0 ? rows.map((row, i) => (
            <tr key={i} className="text-white hover:bg-[#ff6b00]/10 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-6 py-4">{cell}</td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length} className="py-4 text-center text-gray-300">Nenhum dado encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
