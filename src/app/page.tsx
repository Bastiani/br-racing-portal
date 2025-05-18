import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--rich-black)] text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Meu Projeto</h1>
          <nav>
            <ul className="flex gap-6">
              <li><a href="#features" className="hover:text-[var(--gamboge)]">Recursos</a></li>
              <li><a href="#about" className="hover:text-[var(--gamboge)]">Sobre</a></li>
              <li><a href="#contact" className="hover:text-[var(--gamboge)]">Contato</a></li>
              <li>
                <Link 
                  href="/admin" 
                  className="bg-[var(--dark-cyan)] hover:bg-[var(--midnight-green)] px-4 py-2 rounded-md transition-colors"
                >
                  Acessar Painel
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-[var(--rich-black)] to-[var(--midnight-green)] text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Bem-vindo ao Nosso Projeto</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">Uma solução completa para gerenciamento de dados e análise de informações.</p>
            <Link 
              href="/admin" 
              className="bg-[var(--gamboge)] hover:bg-[var(--alloy-orange)] text-white px-6 py-3 rounded-md text-lg font-medium inline-block transition-colors"
            >
              Começar Agora
            </Link>
          </div>
        </section>

        <section id="features" className="py-16 bg-white">
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
        </section>

        <section id="about" className="py-16 bg-gray-50">
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
        </section>
      </main>

      <footer className="bg-[var(--rich-black)] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Meu Projeto. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
