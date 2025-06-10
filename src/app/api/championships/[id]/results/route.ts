import { NextRequest, NextResponse } from 'next/server';
import { getChampionshipResults, importChampionshipResults } from '@/lib/rsf-championship';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const results = await getChampionshipResults(id);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar resultados do campeonato' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const csvData = await request.json();
    
    const results = await importChampionshipResults(csvData, id);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Erro ao importar resultados:', error);
    return NextResponse.json(
      { error: 'Erro ao importar resultados' },
      { status: 500 }
    );
  }
}