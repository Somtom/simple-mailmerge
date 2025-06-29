import * as XLSX from 'xlsx';
import { ExcelColumn, MergeData } from '../types';

export const parseExcelFile = async (file: File): Promise<{
  columns: ExcelColumn[];
  data: MergeData[];
}> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as Array<Array<string | number>>;

    if (jsonData.length === 0) {
      throw new Error('Excel file is empty');
    }

    // Extract headers (first row)
    const headers = jsonData[0] as string[];
    const dataRows = jsonData.slice(1);

    // Create columns with sample values
    const columns: ExcelColumn[] = headers.map((header, index) => ({
      name: header,
      sampleValue: dataRows.length > 0 ? String(dataRows[0][index] || '') : ''
    }));

    // Convert data rows to objects
    const data: MergeData[] = dataRows.map(row => {
      const rowData: MergeData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index] || '';
      });
      return rowData;
    });

    return { columns, data };
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    throw new Error('Failed to parse Excel file');
  }
};
