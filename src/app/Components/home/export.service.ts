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

    // Color scheme matching SmartGrid UI
    const colors = {
      primary: 'FF6400',      // Orange - main brand color
      primaryDark: 'FF5100',  // Darker orange
      headerBg: 'FF6400',     // Orange header background
      headerText: 'FFFFFF',   // White header text
      accent: 'FFE4CC',       // Light orange accent
      border: '333333',       // Dark border
      lightBorder: 'CCCCCC',  // Light border
      altRow: 'F8F9FA',       // Light gray alternate rows
      success: '4CAF50',      // Green for high salary
      warning: 'FF9800',      // Orange for alerts
      text: '363636'          // Dark text
    };

    // Slide 1 - Title Slide
    const slide1 = pptx.addSlide();

    // Background gradient effect with rectangles
    slide1.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: '100%', h: 2.5,
      fill: { color: colors.primary },
      line: { type: 'none' }
    });

    slide1.addText('Employee Report', {
        x: 0.5, y: 0.8, w: 8.5, h: 1,
        fontSize: 44, bold: true, color: colors.headerText,
        fontFace: 'Calibri',
        valign: 'middle',
        align: 'center'
      });

    slide1.addText('Generated from SmartGrid Data', {
        x: 0.5, y: 3, w: 8.5, h: 0.6,
        fontSize: 18, color: colors.primaryDark,
        fontFace: 'Calibri',
        align: 'center'
      });

    // Add footer with timestamp
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    slide1.addText(`Report Generated: ${today}`, {
      x: 0.5, y: 6.8, w: 8.5, h: 0.4,
      fontSize: 10, color: '#999999',
      fontFace: 'Calibri',
      align: 'center'
    });

    // Get row data and column definitions
    const rowData: any[] = [];
    gridApi.forEachNode((node) => rowData.push(node.data));
    const colDefs = gridApi.getColumnDefs() as ColDef[];

    // Constants for table sizing
    const maxTableWidth = 9; // inches - fits standard slide with margins
    const numberOfColumns = colDefs.length;
    const fixedColWidth = maxTableWidth / numberOfColumns;

    // Header cell formatting with professional styling
    const headers = colDefs.map(col => ({
      text: col.headerName || col.field || '',
      options: {
        bold: true,
        fontSize: 12,
        fill: colors.headerBg,
        color: colors.headerText,
        align: 'center',
        valign: 'middle',
        border: [
          { pt: 2, color: colors.border }
        ],
        fontFace: 'Calibri'
      }
    }));

    // Row data with alternating colors
    const rows = rowData.map((row, rowIndex) => {
        return colDefs.map((col, colIndex) => {
          let value = col.field ? String(row[col.field]) : '';

          // Truncate very long text to prevent overflow
          if (value.length > 50) {
            value = value.substring(0, 47) + '...';
          }

          // Alternate row colors for better readability
          const isAlternateRow = rowIndex % 2 === 1;
          let cellFill = isAlternateRow ? colors.altRow : colors.headerText;

          // Default cell options
          const cell: any = {
            text: value,
            options: {
              align: 'center',
              valign: 'middle',
              fontSize: 10,
              color: colors.text,
              border: [
                { pt: 0.5, color: colors.lightBorder }
              ],
              fontFace: 'Calibri',
              fill: cellFill
            }
          };

          // Special formatting for specific columns
          if (col.field === 'salary') {
            const salary = parseFloat(row['salary']);

            // High salary - highlight in orange
            if (salary > 75000) {
              cell.options = {
                ...cell.options,
                bold: true,
                color: colors.primaryDark,
                fill: colors.accent
              };
            }
          } else if (col.field === 'email') {
            // Email column - blue text to indicate it's important
            cell.options = {
              ...cell.options,
              color: '0066CC',
              bold: false
            };
          } else if (col.field === 'name') {
            // Name column - bold for emphasis
            cell.options = {
              ...cell.options,
              bold: true
            };
          }

          return cell;
        });
      });

    // Constants
    const maxRowsPerSlide = 8;

    // Paginate rows and add slides
    for (let i = 0; i < rows.length; i += maxRowsPerSlide) {
      const chunk = rows.slice(i, i + maxRowsPerSlide);
      const slide = pptx.addSlide();

      // Add a subtle header bar to each data slide
      slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: '100%', h: 0.4,
        fill: { color: colors.primary },
        line: { type: 'none' }
      });

      // Add table with professional styling
      slide.addTable([headers, ...chunk], {
        x: 0.25,
        y: 0.6,
        w: maxTableWidth,
        colW: Array(numberOfColumns).fill(fixedColWidth),
        border: { pt: 1, color: colors.border },
        fill: { color: colors.headerText },
        fontFace: 'Calibri',
        fontSize: 10,
        color: colors.text,
        align: 'center',
        valign: 'middle',
        autoPage: false
      });

      // Add page number with styling
      slide.addText(`Page ${Math.floor(i / maxRowsPerSlide) + 1} of ${Math.ceil(rows.length / maxRowsPerSlide)}`, {
        x: 0.5, y: 6.9, w: 8.5, h: 0.3,
        fontSize: 9, color: '#999999',
        fontFace: 'Calibri',
        align: 'right'
      });

      // Add footer line
      slide.addShape(pptx.ShapeType.line, {
        x: 0.25, y: 6.8, w: maxTableWidth, h: 0,
        line: { pt: 1, color: colors.lightBorder }
      });
    }

    // Add summary slide
    const summarytSlide = pptx.addSlide();

    summarytSlide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: '100%', h: 2.5,
      fill: { color: colors.primary },
      line: { type: 'none' }
    });

    summarytSlide.addText('Summary', {
      x: 0.5, y: 0.9, w: 8.5, h: 1,
      fontSize: 44, bold: true, color: colors.headerText,
      fontFace: 'Calibri',
      align: 'center'
    });

    // Summary statistics
    const totalEmployees = rowData.length;
    const avgSalary = rowData.length > 0
      ? Math.round(rowData.reduce((sum, emp) => sum + parseFloat(emp.salary), 0) / rowData.length)
      : 0;
    const highestSalary = rowData.length > 0
      ? Math.max(...rowData.map(emp => parseFloat(emp.salary)))
      : 0;
    const lowestSalary = rowData.length > 0
      ? Math.min(...rowData.map(emp => parseFloat(emp.salary)))
      : 0;

    const summaryData = [
      { label: 'Total Employees', value: totalEmployees.toString() },
      { label: 'Average Salary', value: `$${avgSalary.toLocaleString()}` },
      { label: 'Highest Salary', value: `$${highestSalary.toLocaleString()}` },
      { label: 'Lowest Salary', value: `$${lowestSalary.toLocaleString()}` }
    ];

    let yPosition = 3.2;
    summaryData.forEach((stat) => {
      summarytSlide.addText(stat.label, {
        x: 1, y: yPosition, w: 3.5, h: 0.4,
        fontSize: 14, bold: true, color: colors.primaryDark,
        fontFace: 'Calibri',
        align: 'left'
      });

      summarytSlide.addText(stat.value, {
        x: 4.5, y: yPosition, w: 3.5, h: 0.4,
        fontSize: 14, bold: true, color: colors.headerBg,
        fontFace: 'Calibri',
        align: 'right'
      });

      // Add separator line
      summarytSlide.addShape(pptx.ShapeType.line, {
        x: 1, y: yPosition + 0.45, w: 7, h: 0,
        line: { pt: 0.5, color: colors.lightBorder }
      });

      yPosition += 0.8;
    });

    // Save the file
    pptx.writeFile({ fileName: 'Employee_Report.pptx' });
  }

}
