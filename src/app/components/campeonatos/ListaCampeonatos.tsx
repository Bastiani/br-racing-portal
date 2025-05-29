"use client";

import { useEffect, useMemo } from "react";
import { useRsfOnlineRally } from "@/hooks/useRsfOnlineRally";
import Link from "next/link";
import Image from "next/image";
import imagem from "@/utils/constants/imagens";
import { IconDirectionSign } from "@tabler/icons-react";

interface ListaCampeonatosProps {
  imagens?: string[];
}

export default function ListaCampeonatos({ imagens }: ListaCampeonatosProps) {
  const options = useMemo(
    () => ({
      limit: 16,
      orderBy: {
        column: "created_at",
        ascending: false,
      },
    }),
    []
  );

  const { rallies, loading, error, fetchRallies } = useRsfOnlineRally();

  useEffect(() => {
    fetchRallies(options);
  }, [fetchRallies, options]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#140f15]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Erro ao carregar campeonatos: {error.message}
      </div>
    );
  }

  return (
    <section id="championships" className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#E0E1DD] mb-8">
          Últimos Campeonatos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {rallies?.map((rally, index) => {
            const imagemRally = imagens?.[index] || imagem.campeonatos;

            return (
              <div
                key={rally.id}
                className="bg-[#E0E1DD] text-black text-center rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform"
              >
                <Image
                  src={imagemRally}
                  alt={rally.rally_name}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {rally.rally_name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Criado em:{" "}
                    {new Date(rally.created_at).toLocaleDateString("pt-BR")}
                  </p>
                  <div className="flex justify-end">
                    <Link
                      href={`/campeonatos/${rally.id}`}
                      className="inline-block text-end bg-[#ff6b00] text-white px-4 py-2 rounded-full hover:bg-orange-700/80 transition-colors"
                    >
                      {<IconDirectionSign size={32} />}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
