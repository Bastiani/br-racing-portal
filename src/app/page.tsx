// import Link from 'next/link';
import Pagina from "@/app/components/template/Pagina";
import { ItemCard } from "@/app/components/shared/ItemCard";
import imagem from "@/utils/constants/imagens";
import { IconFlag, IconTrophy } from "@tabler/icons-react";

export default function Home() {
  return (
    <Pagina>
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
          {/* <Link 
              href="/admin" 
              className="bg-[#ff6b00] hover:bg-[#ff8533] text-white px-8 py-4 rounded-md text-xl font-medium inline-block transition-colors"
            >
              Inscreva-se Agora
            </Link> */}
        </div>
      </section>
      <section className="flex md:flex-row flex-col justify-center items-center gap-8 py-16">
        <ItemCard
          url="campeonatos"
          nome="Campeonatos"
          descricao="Resultados dos campeonatos"
          imagem={imagem.campeonatos}
          icone={<IconFlag size={32} />}
        />
        <ItemCard
          url="pilotos"
          nome="Ranking de Pilotos"
          descricao="Tabela de troféis dos pilotos"
          imagem={imagem.pilotos}
          icone={<IconTrophy size={32} />}
        />
      </section>
    </Pagina>
  );
}
