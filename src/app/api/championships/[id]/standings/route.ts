import { NextRequest, NextResponse } from "next/server";
import { getChampionshipStandings } from "@/lib/championship-server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const standings = await getChampionshipStandings(id);
    return NextResponse.json(standings);
  } catch (error) {
    console.error("Erro ao buscar classificação:", error);
    return NextResponse.json(
      { error: "Erro ao buscar classificação do campeonato" },
      { status: 500 }
    );
  }
}
