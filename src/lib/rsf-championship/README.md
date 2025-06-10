# RSF Championship Module

Este módulo contém todas as funcionalidades relacionadas aos campeonatos RSF, incluindo:

- Tabelas: `rsf-championship-standings`, `rsf-custom-championship`, `rsf-results-championship`
- APIs para gerenciamento de campeonatos
- Sistema de pontuação e classificação
- Processamento de resultados CSV

## Estrutura

```
src/lib/rsf-championship/
├── api/
│   └── championship-server.ts    # Funções principais da API
├── scoring/
│   └── championship-scoring.ts   # Sistema de pontuação e cálculos
├── types/                        # Tipos específicos (futuro)
├── index.ts                      # Exportações principais
└── README.md                     # Esta documentação
```

## Funções Principais

### API Functions (`api/championship-server.ts`)

- `getChampionshipResults(championshipId)` - Busca resultados de um campeonato
- `getChampionshipStandings(championshipId)` - Busca classificação do campeonato
- `getDriverPointsHistory(userId, championshipId?)` - Histórico de pontos do piloto
- `importChampionshipResults(csvData, championshipId)` - Importa resultados via CSV
- `recalculateChampionshipTotalPoints(championshipId)` - Recalcula pontos totais
- `getCustomChampionships()` - Lista todos os campeonatos customizados
- `getCustomChampionshipById(championshipId)` - Busca campeonato específico

### Scoring Functions (`scoring/championship-scoring.ts`)

- `filterAndAdjustBrazilianResults(results)` - Filtra pilotos brasileiros
- `getWrcPointsSystem()` - Busca sistema de pontuação WRC
- `calculatePoints(position, pointsSystem)` - Calcula pontos por posição
- `processAndInsertChampionshipData(csvData, championshipId)` - Processa e insere dados
- `calculateDriverTotalPoints(userId, championshipId)` - Calcula pontos totais do piloto
- `updateChampionshipStandings(championshipId)` - Atualiza classificação
- `recalculateChampionshipStandings(championshipId)` - Recalcula classificação

## Uso

```typescript
// Importar funções específicas
import {
  getChampionshipResults,
  getChampionshipStandings,
} from "@/lib/rsf-championship";

// Ou importar tudo
import * as Championship from "@/lib/rsf-championship";
```

## Migração

Os arquivos antigos foram mantidos como proxies para compatibilidade:

- `src/lib/championship-server.ts` → redireciona para este módulo
- `src/lib/scoring/championship-scoring.ts` → redireciona para este módulo

## Funções Removidas (não utilizadas)

- `processChampionshipResults()` - Não era usada em lugar nenhum
- `insertChampionshipResults()` - Não era usada em lugar nenhum
- `verifyAndIncludeUsers()` - Não era usada em lugar nenhum
