// import Link from 'next/link';
import Page from "@/components/pages/home/Page";
import { ItemCard } from "@/components/ui/ItemCard";
import imagem from "@/utils/constants/images";
import { IconFlag, IconTrophy, IconCalendar } from "@tabler/icons-react";
import BaseTable from "@/components/pages/BaseTable";

interface RallyData {
  name: string;
  href: string;
  description: string;
  players_total: number;
  players_finished: number;
  stages_count: number;
  legs_count: number;
  creator: string;
  damage_model: string;
  schedule: {
    start: string;
    end: string | null;
  };
}

async function getRallyData(): Promise<RallyData[]> {
  try {
    const response = await fetch('http://134.122.26.139:3000/api/online/rally-table', {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch rally data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching rally data:', error);
    return [];
  }
}

export default async function Home() {
  const rallyData = await getRallyData();

  const columns = [
    { header: "Nome do Rally", className: "text-left" },
    { header: "Descrição", className: "text-left" },
    { header: "Criador", className: "text-center" },
    { header: "Participantes", className: "text-center" },
    { header: "Finalizaram", className: "text-center" },
    { header: "Especiais", className: "text-center" },
    { header: "Modelo de Dano", className: "text-center" },
    { header: "Data Início", className: "text-center" },
  ];

  const rows = rallyData.map((rally) => [
    <a 
      key={rally.name}
      href={rally.href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-[#ff6b00] hover:text-[#ff6b00]/80 font-semibold underline"
    >
      {rally.name}
    </a>,
    rally.description,
    rally.creator,
    rally.players_total.toString(),
    rally.players_finished.toString(),
    rally.stages_count.toString(),
    rally.damage_model,
    rally.schedule.start || 'N/A',
  ]);

  return (
    <Page>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute h-screen object-cover opacity-30"
        >
          <source src="/logo-animado.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B263B] to-[#E0E1DD]/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-6xl font-bold mb-6 text-white">
            Brasil Rally Championship
          </h2>
          <p className="text-2xl text-white/90 max-w-2xl mx-auto mb-8">
            Club voltado para campeonatos de rally, tanto em simuladores como
            simcade.
          </p>
        </div>
      </section>
      
      <section className="flex md:flex-row flex-col justify-center items-center gap-8 py-16">
        <ItemCard
          url="fourfans"
          nome="4FUN´s"
          descricao="Resultados dos 4FUN´s"
          imagem={imagem.campeonatos}
          icone={<IconFlag size={32} />}
        />
        <ItemCard
          url="pilots"
          nome="Ranking de Pilotos"
          descricao="Tabela de troféis dos pilotos"
          imagem={imagem.pilotos}
          icone={<IconTrophy size={32} />}
        />
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white flex items-center justify-center gap-3">
              <IconCalendar size={40} className="text-[#ff6b00]" />
              Rallys Online Ativos
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Confira os rallys online atualmente disponíveis no RallySimFans
            </p>
          </div>
          
          <div className="bg-[#1B263B]/80 backdrop-blur-sm rounded-lg p-6">
            <BaseTable 
              columns={columns} 
              rows={rows}
              tableClassName="bg-[#1B263B]/50"
              theadClassName="bg-[#ff6b00]"
              tbodyClassName="bg-[#1B263B]/30"
            />
          </div>
        </div>
      </section>
    </Page>
  );
}
