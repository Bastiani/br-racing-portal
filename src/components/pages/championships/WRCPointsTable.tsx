"use client";

import { WRC_POINTS_TABLE } from "@/types/championship";

export default function WRCPointsTable() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="bg-[#140f15] text-white p-4">
        <h3 className="text-xl font-bold">Tabela de Pontuação WRC</h3>
        <p className="text-gray-300 text-sm">
          Sistema oficial sem pontos bônus
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
        {WRC_POINTS_TABLE.map(({ position, points }) => (
          <div
            key={position}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span className="font-semibold text-gray-700">{position}º</span>
            <span className="font-bold text-[#140f15]">{points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
