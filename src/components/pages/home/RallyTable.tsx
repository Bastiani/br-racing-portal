import BaseTable from "@/components/pages/BaseTable";

interface RallyData {
  name: string;
  href: string;
  description: string;
  players_total: number;
  players_finished: number;
  stages_count: number;
  legs_count: number;
  creator: string;
  damage_model: string;
  schedule: {
    start: string;
    end: string | null;
  };
}

async function getRallyData(): Promise<RallyData[]> {
  try {
    const response = await fetch('http://134.122.26.139:3000/api/online/rally-table', {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch rally data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching rally data:', error);
    return [];
  }
}

export default async function RallyTable() {
  const rallyData = await getRallyData();

  const columns = [
    { header: "Nome do Rally", className: "text-left" },
    { header: "Descrição", className: "text-left" },
    { header: "Criador", className: "text-center" },
    { header: "Participantes", className: "text-center" },
    { header: "Finalizaram", className: "text-center" },
    { header: "Especiais", className: "text-center" },
    { header: "Modelo de Dano", className: "text-center" },
    { header: "Data Início", className: "text-center" },
  ];

  const rows = rallyData.map((rally) => [
    <a 
      key={rally.name}
      href={rally.href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-[#ff6b00] hover:text-[#ff6b00]/80 font-semibold underline"
    >
      {rally.name}
    </a>,
    rally.description,
    rally.creator,
    rally.players_total.toString(),
    rally.players_finished.toString(),
    rally.stages_count.toString(),
    rally.damage_model,
    rally.schedule.start || 'N/A',
  ]);

  return (
    <div className="bg-[#1B263B]/80 backdrop-blur-sm rounded-lg p-6">
      <BaseTable 
        columns={columns} 
        rows={rows}
        tableClassName="bg-[#1B263B]/50"
        theadClassName="bg-[#ff6b00]"
        tbodyClassName="bg-[#1B263B]/30"
      />
    </div>
  );
}