import { NextResponse } from 'next/server';
import { getChampionshipStandings } from '@/lib/championshipDB';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(_: any, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = (await params) ?? {};
    const championshipId = parseInt(id);
    
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