import { NextRequest, NextResponse } from 'next/server';
import { getRallyResults } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  
  try {
    const results = await getRallyResults(id);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar resultados do rally' },
      { status: 500 }
    );
  }
}