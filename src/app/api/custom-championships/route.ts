import { NextResponse } from "next/server";
import { getCustomChampionships } from "@/lib/rsf-championship";

export async function GET() {
  try {
    const data = await getCustomChampionships();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar campeonatos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
