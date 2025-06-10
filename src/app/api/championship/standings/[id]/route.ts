import { NextRequest, NextResponse } from 'next/server';
import { getChampionshipStandings } from '@/lib/championshipDB';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const championshipId = parseInt(params.id);
    
    if (isNaN(championshipId)) {
      return NextResponse.json({ error: 'ID do campeonato inválido' }, { status: 400 });
    }

    const standings = await getChampionshipStandings(championshipId);
    
    return NextResponse.json(standings);
  } catch (error) {
    console.error('Erro ao buscar classificação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}