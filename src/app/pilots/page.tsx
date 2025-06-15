import Page from "@/components/pages/home/Page";
import PilotsTable from "../../components/pages/pilots/PilotsTable";
import RsfPilotsTable from "../../components/pages/pilots/RsfPilotsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Pilotos() {
  return (
    <Page className="container">
      <div className="py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Pilotos
        </h1>
        
        <Tabs defaultValue="fourfan" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="fourfan" className="text-lg">
              Pilotos FourFan
            </TabsTrigger>
            <TabsTrigger value="rsf" className="text-lg">
              Pilotos Campeonatos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="fourfan" className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-gray-300 text-lg">
                Estatísticas dos pilotos FourFan
              </p>
            </div>
            <PilotsTable />
          </TabsContent>
          
          <TabsContent value="rsf" className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-gray-300 text-lg">
                Pilotos cadastrados nos campeonatos da RSF
              </p>
            </div>
            <RsfPilotsTable />
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  );
}
