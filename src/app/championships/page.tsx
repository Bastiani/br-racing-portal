import ChampionshipsList from "@/components/pages/championships/ChampionshipsList";
import Page from "@/components/pages/home/Page";
import imagens from "@/utils/constants/championshipImages";

export default function Campeonatos() {
  return (
    <Page className="container">
      <ChampionshipsList imagens={imagens} />
    </Page>
  );
}
