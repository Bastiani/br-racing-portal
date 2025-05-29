import ListaCampeonatos from "@/app/components/campeonatos/ListaCampeonatos";
import Pagina from "@/app/components/template/Pagina";
import imagens from "@/utils/constants/imagensCampeonatos";

export default function Campeonatos() {
  return (
    <Pagina className="container">
      <ListaCampeonatos imagens={imagens} />
    </Pagina>
  );
}
