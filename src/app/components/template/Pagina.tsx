import Cabecalho from "./Cabecalho";
import Rodape from "./Rodape";

export interface PaginaProps {
  children: React.ReactNode;
  className?: string;
  semCabecalho?: boolean;
  semRodape?: boolean;
}

export default function Pagina(props: PaginaProps) {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        background:
          "radial-gradient(50% 50% at 50% 50%, #0D1B2A 0%, #1B263B 100%)",
      }}
    >
      <div
        className="flex-1 flex flex-col w-screen"
        style={{
          background: 'url("/background.png")',
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
        }}
      >
        {!props.semCabecalho && <Cabecalho />}
        <main className={`flex-1 flex flex-col ${props.className ?? ""}`}>
          {props.children}
        </main>
        {!props.semRodape && <Rodape />}
      </div>
    </div>
  );
}
