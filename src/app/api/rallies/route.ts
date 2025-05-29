import { NextResponse } from 'next/server';
import { getAllRallies, getRallyById } from '@/lib/supabase-server';

// GET /api/rallies
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Se um ID for fornecido, busca um rally específico
      const rally = await getRallyById(id);
      return NextResponse.json(rally);
    } else {
      // Caso contrário, busca todos os rallies
      const rallies = await getAllRallies();
      return NextResponse.json(rallies);
    }
  } catch (error) {
    console.error('Erro na API de rallies:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados de rallies' },
      { status: 500 }
    );
  }
}