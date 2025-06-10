import { NextRequest, NextResponse } from "next/server";
import { createFourFanRally, getFourFanLatestRallies } from "@/lib/fourFanDB";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rally_name, rally_id } = body;

    if (!rally_name || !rally_id) {
      return NextResponse.json(
        { error: "Nome do rally e ID são obrigatórios" },
        { status: 400 }
      );
    }

    const newRally = await createFourFanRally({
      rally_name,
      rally_id: parseInt(rally_id),
    });

    return NextResponse.json(newRally, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar rally:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const rallies = await getFourFanLatestRallies(10);
    return NextResponse.json(rallies);
  } catch (error) {
    console.error("Erro ao buscar rallies:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
