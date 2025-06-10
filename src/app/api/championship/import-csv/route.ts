import { NextRequest, NextResponse } from 'next/server';
import { processStageResultsCSV, calculateAndInsertRallyResult, updateRallyPositionsAndPoints, updateChampionshipStandings } from '@/lib/championshipDB';
import { parseCSV } from '@/utils/parseCSV';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const championshipId = parseInt(formData.get('championshipId') as string);
    const rallyId = parseInt(formData.get('rallyId') as string);
    const stageName = formData.get('stageName') as string;
    const stageNumber = parseInt(formData.get('stageNumber') as string);

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
    // Filtrar e validar pilotIds antes de processar
    const validPilotIds = csvData
      .map(row => {
        const parsedId = row.userid;
        
        if (isNaN(parsedId) || !parsedId) {
          console.warn(`Invalid userid found: '${parsedId}' in row:`, row);
          return null;
        }
        
        return parsedId;
      })
      .filter(id => id !== null) // Remove valores nulos
      .filter((id, index, array) => array.indexOf(id) === index); // Remove duplicatas
    
    console.log('Valid pilot IDs:', validPilotIds);
    
    if (validPilotIds.length === 0) {
      return NextResponse.json({ 
        error: 'Nenhum ID de piloto válido encontrado no CSV. Verifique se a coluna userid existe e contém valores numéricos válidos.' 
      }, { status: 400 });
    }
    
    for (const pilotId of validPilotIds) {
      try {
        await calculateAndInsertRallyResult(rallyId, pilotId);
      } catch (error) {
        console.error(`Erro ao calcular resultado do piloto ${pilotId}:`, error);
      }
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