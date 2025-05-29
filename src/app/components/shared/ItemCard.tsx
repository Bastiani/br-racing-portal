import Image from "next/image";
import Link from "next/link";

export default interface ItemCardProps {
  url: string;
  nome: string;
  descricao: string;
  imagem: string;
  icone?: React.ReactNode;
}

export function ItemCard(props: ItemCardProps) {
  return (
    <div className="flex flex-col bg-[#E0E1DD] border border-zinc-950 rounded-xl overflow-hidden">
      <div className="flex flex-col items-center gap-10">
        <Image
          src={props.imagem}
          alt={props.nome}
          width={300}
          height={200}
          className="object-contain"
        />
        <div className="flex flex-col items-center p-2">
          <h3 className="text-zinc-950 text-xl font-bold">{props.nome}</h3>
          <p className="text-zinc-500 text-lg">{props.descricao}</p>
        </div>
        <Link
          href={`/${props.url}`}
          className="self-end mb-8 mr-4 bg-[#ff6b00] hover:bg-[#ff8533] text-white px-4 py-2 rounded-full text-lg font-medium transition-colors"
        >
          {props.icone || "Acessar"}
        </Link>
      </div>
    </div>
  );
}
