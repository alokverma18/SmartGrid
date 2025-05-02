import { Injectable, inject } from '@angular/core';
import PptxGenJS from 'pptxgenjs';
import { ColDef, GridApi } from 'ag-grid-community';

@Injectable({
  providedIn: 'root',
})
export class ExportService {

  constructor() {}
  
  generatePowerPoint(gridApi: GridApi): void {
    const pptx = new PptxGenJS();
  
    // Slide 1 - Title
    const slide1 = pptx.addSlide();
    slide1.addText('My Report', {
        x: 1, y: 1, w: 8, h: 1,
        fontSize: 32, bold: true,
        valign: 'middle'
      });
      slide1.addText('Generated from ag-Grid Data', {
        x: 1, y: 2, w: 8, h: 0.8,
        fontSize: 20,
        valign: 'middle'
      });
  
    // Get row data and column definitions
    const rowData: any[] = [];
    gridApi.forEachNode((node) => rowData.push(node.data));
    const colDefs = gridApi.getColumnDefs() as ColDef[];
  
    // Header cell formatting
    const headers = colDefs.map(col => ({
      text: col.headerName || col.field || '',
      options: {
        bold: true,
        fontSize: 12,
        fill: 'D9E1F2',
        color: '000000',
        align: 'center',
        valign: 'middle',
        border: [{ pt: 1, color: '000000' }]
      }
    }));
  
    const rows = rowData.map(row => {
        return colDefs.map(col => {
          const value = col.field ? String(row[col.field]) : '';
      
          // Default cell options
          const cell: any = { text: value };
      
          // Apply conditional formatting to salary cell
          if (col.field === 'salary') {
            const isIdEven = row['id'] % 2 === 0;
            const isHighSalary = row['salary'] > 100000;
      
            if (isIdEven && isHighSalary) {
              cell.options = {
                bold: true,
                color: 'FF0000',  // Red text
                fill: 'FFFF00'    // Yellow background
              };
            }
          }
      
          return cell;
        });
      });
      
      const estimatedColWidths = colDefs.map(col => {
        const headerText = col.headerName || col.field || '';
        
        if (!col.field) return headerText.length * 0.08 + 0.3;
      
        const maxDataLength = rowData.reduce((max, row) => {
          const val = row[col.field!];
          return Math.max(max, val ? String(val).length : 0);
        }, headerText.length); // start with header length
      
        return maxDataLength * 0.08 + 0.3; // tweak multiplier for PPT sizing
      });
      
      
      
    // Constants
    const maxRowsPerSlide = 10;
  
    // Paginate rows and add slides
    for (let i = 0; i < rows.length; i += maxRowsPerSlide) {
      const chunk = rows.slice(i, i + maxRowsPerSlide);
      const slide = pptx.addSlide();
      slide.addTable([headers, ...chunk], {
        x: 0.5,
        y: 0.5,
        colW: estimatedColWidths,   // ✅ use computed widths
        border: { pt: 1, color: '000000' },
        fill: { color: 'F1F1F1' },
        fontFace: 'Avenir Next LT Pro',
        fontSize: 8,
        color: '363636',
        align: 'center',
        valign: 'middle',
        autoPage: false,
      });
      
    }
  
    // Save the file
    pptx.writeFile({ fileName: 'Report.pptx' });
  }
  
  
}
