import { NextResponse } from "next/server";
import { getCustomChampionshipById } from "@/lib/rsf-championship";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getCustomChampionshipById(id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar campeonato:", error);
    return NextResponse.json(
      { error: "Campeonato não encontrado" },
      { status: 404 }
    );
  }
}
