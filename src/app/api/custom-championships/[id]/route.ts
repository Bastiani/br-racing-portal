import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient();

    const { data, error } = await supabase
      .from("rsf-custom-championship")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar campeonato:", error);
      return NextResponse.json(
        { error: "Campeonato não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar campeonato:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
