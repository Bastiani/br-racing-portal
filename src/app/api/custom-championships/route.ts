import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("rsf-custom-championship")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar campeonatos:", error);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar campeonatos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
