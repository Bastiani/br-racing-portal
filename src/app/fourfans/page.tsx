import FourFansList from "@/components/pages/fourfans/FourFanList";
import Page from "@/components/pages/home/Page";
import imagens from "@/utils/constants/championshipImages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "4FUN's - Resultados",
  description: "Confira os resultados dos 4FUN's do Brasil Rally Championship. Acompanhe todas as corridas e resultados dos eventos especiais.",
  keywords: [
    "4fun rally",
    "fourfun resultados",
    "rally 4fun",
    "resultados rally",
    "eventos rally",
    "corridas 4fun",
    "brasil rally 4fun"
  ],
  openGraph: {
    title: "4FUN's - Resultados | Brasil Rally Championship",
    description: "Confira os resultados dos 4FUN's do Brasil Rally Championship. Acompanhe todas as corridas e resultados dos eventos especiais.",
    url: "/fourfans",
  },
  twitter: {
    title: "4FUN's - Resultados | Brasil Rally Championship",
    description: "Confira os resultados dos 4FUN's do Brasil Rally Championship.",
  },
};

export default function FourFanRallies() {
  return (
    <Page className="container">
      <FourFansList imagens={imagens} />
    </Page>
  );
}
