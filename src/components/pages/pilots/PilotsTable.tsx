import Image from "next/image";
import { getAllPilots } from "@/lib/fourFanDB";
import BaseTable from "../BaseTable";

export type Pilot = {
  id: string; // ou 'number', depende de como está na sua tabela Supabase.
  name: string;
  first: number | string; // depende se é número ou string.
  second: number | string;
  third: number | string;
};

export default async function PilotsTable() {
  const pilots = await getAllPilots();

  const columns = [
    { header: "Nome" },
    { header: "1º Lugar", className: "text-center" },
    { header: "2º Lugar", className: "text-center" },
    { header: "3º Lugar", className: "text-center" },
  ];

  const rows =
    pilots && pilots.length > 0
      ? pilots.map((pilot) => [
          pilot.name,
          <div className="flex flex-col items-center" key="first">
            <Image src="/trofeu-1.png" alt="1º Lugar" width={32} height={32} />
            <span className="mt-1 text-lg font-semibold">{pilot.first}</span>
          </div>,
          <div className="flex flex-col items-center" key="second">
            <Image src="/trofeu-2.png" alt="2º Lugar" width={32} height={32} />
            <span className="mt-1 text-lg font-semibold">{pilot.second}</span>
          </div>,
          <div className="flex flex-col items-center" key="third">
            <Image src="/trofeu-3.png" alt="3º Lugar" width={32} height={32} />
            <span className="mt-1 text-lg font-semibold">{pilot.third}</span>
          </div>,
        ])
      : [];

  return (
    <section className="my-12">
      <h2 className="text-2xl text-white font-bold mb-4">Pilotos</h2>
      <div
        className="relative rounded-lg p-2 shadow-2xl"
        style={{
          backgroundImage: "url('/fundo-tabela-pilotos.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay de opacidade */}
        <div
          className="absolute inset-0 bg-black/60 rounded-lg pointer-events-none"
          style={{ zIndex: 1 }}
        />
        <div className="relative z-10">
          <BaseTable columns={columns} rows={rows} />
        </div>
      </div>
    </section>
  );
}
