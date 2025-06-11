/* eslint-disable @typescript-eslint/no-explicit-any */
export function parseCSV(
  csvData: {
    position: string;
    userid: string;
    user_name: string;
    real_name: string;
    nationality: string;
    car: string;
    time3: string;
    super_rally: string;
    penalty: string;
  }[],
  championshipId: string,
  rsfRallyId?: number | null
) {
  return csvData.map((row) => {
    // Pega a primeira (e única) chave do objeto
    const key = Object.keys(row)[0];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - A key is always a string
    const value = row[key];

    // Remove as aspas duplas e divide pelos pontos e vírgulas
    const headers = key.replace(/"/g, "").split(";");
    const values = String(value || "")
      .replace(/"/g, "")
      .split(";");

    // Cria um objeto com as propriedades corretas
    const rowData: any = {};
    headers.forEach((header, index) => {
      rowData[header] = values[index];
    });

    return {
      position: parseInt(rowData.position) || null,
      userid: parseInt(rowData.userid) || null,
      user_name: rowData.user_name || null,
      real_name: rowData.real_name || null,
      nationality: rowData.nationality || null,
      car: rowData.car || null,
      time3: rowData.time3 || null,
      super_rally: parseInt(rowData.super_rally) || 0,
      penalty: parseInt(rowData.penalty) || 0,
      rsf_rally: championshipId,
      rsf_rally_id: rsfRallyId || null,
    };
  });
}
