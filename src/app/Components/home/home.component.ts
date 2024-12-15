import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {MatSnackBar} from '@angular/material/snack-bar'; 
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowSelectionOptions,
  createGrid,
} from "ag-grid-community";
import { DataService } from "./data.service";
import { CommonModule } from "@angular/common";

interface EmployeeData {
  id : Number, 
  name: String, 
  email: String, 
  phone: Number, 
  address: String, 
  salary: Number
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AgGridAngular, CommonModule ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

  public columnDefs: ColDef[] = [
    { field: "id", editable: false},
    { field: "name" },
    { field: "email" },
    { field: "phone" },
    { field: "address" },
    { field: "salary" },
  ];
  public defaultColDef: ColDef = {
    editable: true,
    filter: true,
    sortable: true,
    flex: 1,
    minWidth: 100,
    resizable: true,
  };
  public rowData!: EmployeeData[];
  public themeClass: string =
    "ag-theme-quartz";

  constructor(
    private dataService : DataService,
    private snackBar: MatSnackBar
  ) {}

  private gridApi!: GridApi;

  onGridReady(params: GridReadyEvent<EmployeeData>) {
    this.dataService.getData().subscribe((data) => {
      (this.rowData = data);
      this.gridApi = params.api;
      // console.log(this.rowData);
    });
  }
  public pagination = true;
  public paginationPageSize = 10;
  public paginationPageSizeSelector = [5, 10, 20];

  public rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
    headerCheckbox: false,
  };

  public isRowSelected: boolean = false;

  onSelectionChanged(event: any) {
    this.isRowSelected = this.gridApi?.getSelectedRows().length > 0;
    if (this.isRowSelected) {
      console.log(this.gridApi.getSelectedRows())
    }
  }

  onCellEdit(event: any) {
    if(event.oldValue !== event.newValue) {
      console.log("Cell Edited");
      console.log(event.data.id, event.data);
      this.dataService.updateData(event.data.id, event.data).subscribe((data) => {
        console.log(data);
      });
      this.snackBar.open(
        'Data Updated Successfully', 
        'Done', {
        duration: 2000,
        verticalPosition: 'top', // Allowed values are  'top' | 'bottom'
        horizontalPosition: 'center', // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
      });
    }
  }

  delete() {
    console.log("Delete Button Clicked");
    const selectedData = this.gridApi.getSelectedRows();
  
    selectedData.forEach((data) => {
      this.dataService.deleteData(data.id).subscribe(
        (response) => {
          console.log(response);
          // Refresh the grid data after deletion
          this.gridApi.applyTransaction({ remove: [data] });
        },
        (error) => {
          console.error("Error deleting data:", error);
        }
      );
    });
  }
  
}
