import { getAllRsfPilots, getPilotChampionships, PilotChampionshipData } from "@/lib/championshipDB";
import BaseTable from "../BaseTable";
import { RsfPilot } from "@/types/championship";
import { Badge } from "@/components/ui/badge";
import ReactCountryFlag from "react-country-flag";

interface RsfPilotWithChampionships extends RsfPilot {
  championships: PilotChampionshipData[];
}

export default async function RsfPilotsTable() {
  const pilots = await getAllRsfPilots();
  const allChampionships = await getPilotChampionships();

  // Agrupar campeonatos por piloto
  const pilotsWithChampionships: RsfPilotWithChampionships[] = pilots.map(pilot => ({
    ...pilot,
    championships: allChampionships.filter(champ => champ.userid === pilot.userid)
  }));

  const columns = [
    { header: "Nome de Usuário", className: "min-w-[150px]" },
    { header: "Nome Real", className: "min-w-[150px]" },
    { header: "Nacionalidade", className: "text-center min-w-[120px]" },
    { header: "Campeonatos", className: "min-w-[200px]" },
    { header: "Total de Pontos", className: "text-center min-w-[120px]" },
    { header: "Vitórias", className: "text-center min-w-[100px]" },
    { header: "Pódios", className: "text-center min-w-[100px]" },
  ];

  const rows = pilotsWithChampionships.map((pilot) => {
    const totalPoints = pilot.championships.reduce((sum, champ) => sum + champ.total_points, 0);
    const totalWins = pilot.championships.reduce((sum, champ) => sum + champ.wins, 0);
    const totalPodiums = pilot.championships.reduce((sum, champ) => sum + champ.podiums, 0);
    
    return [
      <div key="username" className="font-medium text-orange-400">
        {pilot.username}
      </div>,
      <div key="real_name" className="text-white">
        {pilot.real_name || '-'}
      </div>,
      <div key="nationality" className="text-center flex items-center justify-center gap-2">
        <ReactCountryFlag
          countryCode={pilot.nationality || 'BR'}
          svg
          style={{
            width: "1.5em",
            height: "1.5em",
          }}
          title={pilot.nationality}
        />
      </div>,
      <div key="championships" className="space-y-1">
        {pilot.championships.length > 0 ? (
          pilot.championships.slice(0, 3).map((champ, index) => (
            <div key={index} className="flex items-center gap-2">
              <Badge 
                variant={champ.status === 'active' ? 'default' : 'secondary'}
                className={champ.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}
              >
                {champ.championship_name} ({champ.season})
              </Badge>
              {champ.current_position && (
                <span className="text-xs text-gray-400">#{champ.current_position}</span>
              )}
            </div>
          ))
        ) : (
          <span className="text-gray-400 text-sm">Nenhum campeonato</span>
        )}
        {pilot.championships.length > 3 && (
          <div className="text-xs text-gray-400">
            +{pilot.championships.length - 3} mais
          </div>
        )}
      </div>,
      <div key="total_points" className="text-center font-semibold text-orange-400">
        {totalPoints}
      </div>,
      <div key="wins" className="text-center">
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold text-yellow-400">{totalWins}</span>
        </div>
      </div>,
      <div key="podiums" className="text-center">
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold text-blue-400">{totalPodiums}</span>
        </div>
      </div>,
    ];
  });

  return (
    <BaseTable columns={columns} rows={rows} tableClassName="bg-transparent" />
  );
}