import { NextRequest, NextResponse } from 'next/server';
import { getRallyResults } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params ?? {}

    if (!id) {
      return NextResponse.json(
        { error: 'Erro ao buscar resultados do rally' },
        { status: 404 }
      );
    }
    const results = await getRallyResults(id as string);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar resultados do rally' },
      { status: 500 }
    );
  }
}