export default function Rodape() {
  return (
    <div>
      <div className="h-px bg-gradient-to-r from-slate-500 via-slate-100 to-slate-500"></div>
      <footer className="flex flex-col bg-[var(--rich-black)] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} Brasil Rally Championship. Todos
            os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
