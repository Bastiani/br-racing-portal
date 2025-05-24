/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import { getAllPilots } from '@/lib/supabase-server';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default async function PilotsTable() {
  const pilots = await getAllPilots();

  return (
    <section className="my-12">
      <h2 className="text-2xl text-black font-bold mb-4">Pilotos (click para ver detalhes)</h2>
      <div
        className="relative rounded-lg p-2 shadow-2xl"
        style={{
          backgroundImage: "url('/fundo-tabela-pilotos.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay de opacidade */}
        <div className="absolute inset-0 bg-black/80 rounded-lg pointer-events-none" style={{zIndex:1}} />
        <div className="relative z-10">
          <Accordion type="single" collapsible className="w-full">
            {pilots && pilots.map((pilot: any, index: number) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-white/20">
                <AccordionTrigger className="text-white hover:text-white/80 text-lg py-6">
                  {pilot.name}
                </AccordionTrigger>
                <AccordionContent className="text-white">
                  <div className="flex justify-around items-center p-4">
                    <div className="flex flex-col items-center">
                      <Image src="/trofeu-1.png" alt="1º Lugar" width={48} height={48} />
                      <span className="mt-2 text-lg font-semibold">{pilot.first}</span>
                      <span className="text-sm text-white/70">1º Lugar</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Image src="/trofeu-2.png" alt="2º Lugar" width={48} height={48} />
                      <span className="mt-2 text-lg font-semibold">{pilot.second}</span>
                      <span className="text-sm text-white/70">2º Lugar</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Image src="/trofeu-3.png" alt="3º Lugar" width={48} height={48} />
                      <span className="mt-2 text-lg font-semibold">{pilot.third}</span>
                      <span className="text-sm text-white/70">3º Lugar</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
