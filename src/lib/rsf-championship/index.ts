// API functions
export {
  getChampionshipResults,
  getChampionshipStandings,
  getDriverPointsHistory,
  importChampionshipResults,
  recalculateChampionshipTotalPoints,
  getCustomChampionships,
  getCustomChampionshipById,
} from "./api/championship-server";

// Scoring functions
export {
  filterAndAdjustBrazilianResults,
  getWrcPointsSystem,
  calculatePoints,
  processAndInsertChampionshipData,
  calculateDriverTotalPoints,
  updateChampionshipStandings,
  recalculateChampionshipStandings,
} from "./scoring/championship-scoring";

// Types
export * from "./types"; // API functions
