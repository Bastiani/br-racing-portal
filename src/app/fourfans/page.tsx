import FourFansList from "@/components/pages/fourfans/FourFanList";
import Page from "@/components/pages/home/Page";
import imagens from "@/utils/constants/championshipImages";

export default function FourFanRallies() {
  return (
    <Page className="container">
      <FourFansList imagens={imagens} />
    </Page>
  );
}
