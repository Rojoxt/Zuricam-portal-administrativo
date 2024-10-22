import * as XLSX from 'xlsx';

export function exportToExcel(data: any[]) {
  // Convierte los datos a un formato que xlsx pueda entender
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Crea un nuevo libro de trabajo y añade la hoja de trabajo
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja 1');

  // Escribe el libro de trabajo a un archivo de Excel
  XLSX.writeFile(workbook, 'Lista.xlsx');
}
