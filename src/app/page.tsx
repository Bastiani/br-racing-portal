// import Link from 'next/link';
import Page from "@/components/pages/home/Page";
import { ItemCard } from "@/components/ui/ItemCard";
import imagem from "@/utils/constants/images";
import { IconFlag, IconTrophy, IconCalendar } from "@tabler/icons-react";
import { Suspense } from "react";
// import RallyTable from "@/components/pages/home/RallyTable";

function RallyTableSkeleton() {
  return (
    <div className="bg-[#1B263B]/80 backdrop-blur-sm rounded-lg p-6">
      <div className="animate-pulse">
        <div className="bg-[#ff6b00] h-12 rounded-t-lg mb-4"></div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex space-x-4 mb-4">
            <div className="h-4 bg-gray-600 rounded flex-1"></div>
            <div className="h-4 bg-gray-600 rounded flex-1"></div>
            <div className="h-4 bg-gray-600 rounded w-20"></div>
            <div className="h-4 bg-gray-600 rounded w-16"></div>
            <div className="h-4 bg-gray-600 rounded w-16"></div>
            <div className="h-4 bg-gray-600 rounded w-16"></div>
            <div className="h-4 bg-gray-600 rounded w-24"></div>
            <div className="h-4 bg-gray-600 rounded w-20"></div>
          </div>
        ))}
      </div>
      <div className="text-center mt-6">
        <div className="inline-flex items-center gap-2 text-white/70">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#ff6b00]"></div>
          <span>Carregando rallys online...</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {

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
              Rallys Online Ativos (em breve)
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Confira os rallys online atualmente disponíveis no RallySimFans
            </p>
          </div>
          
          <Suspense fallback={<RallyTableSkeleton />}>
            {/* <RallyTable /> */}
          </Suspense>
        </div>
      </section>
    </Page>
  );
}
