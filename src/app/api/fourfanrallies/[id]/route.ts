import { NextRequest, NextResponse } from "next/server";
import { getFourFanRallyById } from "@/lib/fourFanDB";
// import { createClient } from '@supabase/supabase-js';

// Inicializa o cliente Supabase
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET /api/rallies/[id]
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = (await params) ?? {};

  if (!id) {
    return NextResponse.json(
      { error: "Erro ao buscar resultados do rally" },
      { status: 404 }
    );
  }

  try {
    const rally = await getFourFanRallyById(id as string);
    return NextResponse.json(rally);
  } catch (error) {
    console.error(`Erro ao buscar rally com ID ${id}:`, error);
    return NextResponse.json(
      { error: `Rally com ID ${id} não encontrado` },
      { status: 404 }
    );
  }
}

// PUT /api/rallies/[id] - Atualiza um rally existente
// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const body = await request.json();

//     // Verifica se o corpo da requisiu00e7u00e3o contu00e9m dados vu00e1lidos
//     if (!body.rally_name && body.rally_id === undefined) {
//       return NextResponse.json(
//         { error: 'Dados invu00e1lidos para atualizau00e7u00e3o' },
//         { status: 400 }
//       );
//     }

//     // Atualiza o rally no Supabase
//     const { data, error } = await supabase
//       .from('rsf-online-rally')
//       .update({
//         ...(body.rally_name && { rally_name: body.rally_name }),
//         ...(body.rally_id !== undefined && { rally_id: body.rally_id })
//       })
//       .eq('id', params.id)
//       .select();

//     if (error) throw error;

//     if (!data || data.length === 0) {
//       return NextResponse.json(
//         { error: `Rally com ID ${params.id} não encontrado` },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(data[0]);
//   } catch (error) {
//     console.error(`Erro ao atualizar rally com ID ${params.id}:`, error);
//     return NextResponse.json(
//       { error: 'Erro ao atualizar rally' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE /api/rallies/[id] - Exclui um rally
// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // Exclui o rally do Supabase
//     const { error } = await supabase
//       .from('rsf-online-rally')
//       .delete()
//       .eq('id', params.id);

//     if (error) throw error;

//     return NextResponse.json(
//       { success: true, message: `Rally com ID ${params.id} excluido com sucesso` }
//     );
//   } catch (error) {
//     console.error(`Erro ao excluir rally com ID ${params.id}:`, error);
//     return NextResponse.json(
//       { error: 'Erro ao excluir rally' },
//       { status: 500 }
//     );
//   }
// }
