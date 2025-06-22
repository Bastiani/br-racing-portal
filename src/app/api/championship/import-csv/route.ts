import { NextResponse } from 'next/server';
// Primeiro, importe a nova função
import { processStageResultsCSV, calculateAndInsertRallyResult, updateRallyPositionsAndPoints, updateChampionshipStandings, getPilotsByStageId } from '@/lib/championshipDB';
import { parseCSV } from '@/utils/parseCSV';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const championshipId = parseInt(formData.get('championshipId') as string);
    const rallyId = parseInt(formData.get('rallyId') as string);
    const stageName = formData.get('stageName') as string;
    const stageNumber = parseInt(formData.get('stageNumber') as string);
    const categoryId = parseInt(formData.get('categoryId') as string);

    if (!file) {
      return NextResponse.json({ error: 'Arquivo não fornecido' }, { status: 400 });
    }

    // Ler o conteúdo do arquivo CSV
    const csvText = await file.text();
    const lines = csvText.split('\n');
    const headers = lines[0].split(';').map(h => h.trim().replace(/"/g, ''));
    
    // Debug: Log headers para verificar estrutura
    console.log('CSV Headers:', headers);
    
    // Converter CSV para array de objetos usando a função existente
    const rawCsvData = lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(';').map(v => v.trim().replace(/"/g, ''));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj: any = {};
        // Criar um objeto temporário no formato esperado pela função parseCSV
        const tempKey = headers.join(';');
        obj[tempKey] = values.join(';');
        return obj;
      });

    // Usar a função parseCSV existente
    const csvData = parseCSV(rawCsvData, championshipId.toString(), rallyId);
    
    // Debug: Log primeira linha de dados
    if (csvData.length > 0) {
      console.log('First parsed CSV row:', csvData[0]);
    }

    // Processar resultados da etapa
    const result = await processStageResultsCSV(csvData, rallyId, stageName, stageNumber);
    
    if (!result.success) {
      return NextResponse.json({ error: result.message, details: result.errors }, { status: 400 });
    }

    // Calcular resultados gerais do rally para todos os pilotos
    // Buscar apenas pilotos que foram realmente inseridos na etapa
    try {
      const validPilotIds = await getPilotsByStageId(result.stageId!);
      
      console.log('Valid pilot IDs from stage results:', validPilotIds);
      
      if (validPilotIds.length === 0) {
        return NextResponse.json({ 
          error: 'Nenhum piloto encontrado nos resultados da etapa.' 
        }, { status: 400 });
      }
      
      for (const pilotId of validPilotIds) {
        try {
          await calculateAndInsertRallyResult(rallyId, pilotId, categoryId);
        } catch (error) {
          console.error(`Erro ao calcular resultado do piloto ${pilotId}:`, error);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar pilotos da etapa:', error);
      return NextResponse.json({ error: 'Erro ao buscar pilotos da etapa' }, { status: 500 });
    }

    // Atualizar posições e pontos do rally
    await updateRallyPositionsAndPoints(rallyId);

    // Atualizar classificação do campeonato
    await updateChampionshipStandings(championshipId);

    return NextResponse.json({ message: 'CSV processado com sucesso' });
  } catch (error) {
    console.error('Erro ao processar CSV:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}