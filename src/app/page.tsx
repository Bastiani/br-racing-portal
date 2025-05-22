// import Link from 'next/link';
import Image from 'next/image';
import { ChampionshipList } from '@/components/ChampionshipList';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#eedabf]">
      <header className="bg-[#eedabf]/95 text-[#140f15] py-2 fixed w-full z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image 
              src="/logo.png" 
              alt="Brasil Rally Championship Logo" 
              width={90} 
              height={100} 
              className="object-contain"
            />
          </div>
          <nav>
            <ul className="flex gap-6 items-center">
              <li><a href="#championships" className="hover:text-[#ff6b00] transition-colors">Campeonatos</a></li>
              <li><a href="#drivers" className="hover:text-[#ff6b00] transition-colors">Pilotos</a></li>
              <li><a href="#about" className="hover:text-[#ff6b00] transition-colors">Sobre</a></li>
              {/* <li>
                <Link 
                  href="/admin" 
                  className="bg-[#ff6b00] hover:bg-[#ff8533] px-4 py-2 rounded-md transition-colors"
                >
                  Área do Piloto
                </Link>
              </li> */}
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute w-full h-full object-cover opacity-30"
          >
            <source src="/logo-animado.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#ff6b00]/20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-6xl font-bold mb-6 text-white">Brasil Rally Championship</h2>
            <p className="text-2xl text-white/90 max-w-2xl mx-auto mb-8">
              Club voltado para campeonatos de rally, tanto em simuladores como simcade.
            </p>
            {/* <Link 
              href="/admin" 
              className="bg-[#ff6b00] hover:bg-[#ff8533] text-white px-8 py-4 rounded-md text-xl font-medium inline-block transition-colors"
            >
              Inscreva-se Agora
            </Link> */}
          </div>
        </section>
        <section id="championships" className="py-16 bg-gray-100">
          <ChampionshipList />
        </section>

        {/* <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-[var(--rich-black)]">Nossos Recursos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Dashboard Intuitivo',
                  description: 'Interface amigável com visualizações claras e objetivas dos seus dados.',
                  color: 'bg-[var(--tiffany-blue)]'
                },
                {
                  title: 'Relatórios Detalhados',
                  description: 'Gere relatórios personalizados com as informações que você precisa.',
                  color: 'bg-[var(--dark-cyan)]'
                },
                {
                  title: 'Configurações Avançadas',
                  description: 'Personalize o sistema de acordo com as necessidades do seu negócio.',
                  color: 'bg-[var(--midnight-green)]'
                }
              ].map((feature, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                  <div className={`${feature.color} h-2`}></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-[var(--rich-black)]">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* <section id="about" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-[var(--rich-black)]">Sobre Nós</h2>
            <p className="text-lg text-center max-w-3xl mx-auto text-gray-600">
              Somos uma equipe dedicada a criar soluções inovadoras para ajudar empresas a gerenciar seus dados de forma eficiente e segura.
              Nossa missão é simplificar processos complexos através de tecnologia intuitiva e acessível.
            </p>
          </div>
        </section>

        <section id="contact" className="py-16 bg-[var(--vanilla)]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8 text-[var(--rich-black)]">Entre em Contato</h2>
            <p className="text-lg mb-8 text-[var(--rich-black)]">
              Estamos prontos para ajudar você a implementar nossa solução em seu negócio.
            </p>
            <a 
              href="mailto:contato@exemplo.com" 
              className="bg-[var(--gamboge)] hover:bg-[var(--alloy-orange)] text-white px-6 py-3 rounded-md text-lg font-medium inline-block transition-colors"
            >
              Fale Conosco
            </a>
          </div>
        </section> */}
      </main>

      <footer className="bg-[var(--rich-black)] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Brasil Rally Championship. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
