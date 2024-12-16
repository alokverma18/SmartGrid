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
    this.dataService.getData().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.rowData = response.body;
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.snackBar.open(
          'Failed to load data', 
          'Try again!', {
          duration: 2000,
          verticalPosition: 'top', 
          horizontalPosition: 'center',
          });
      },
    });
      this.gridApi = params.api;
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
      this.dataService.updateData(event.data.id, event.data).subscribe({
        next: (response) => {
          if (response.status === 200) {
            console.log(response.body);
            this.snackBar.open(
              'Data Updated Successfully', 
              'Done!', {
              duration: 2000,
              verticalPosition: 'top', // Allowed values are  'top' | 'bottom'
              horizontalPosition: 'center', // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
            });
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.snackBar.open(
            'Failed to Update the data', 
            'Try again!', {
            duration: 2000,
            verticalPosition: 'top', 
            horizontalPosition: 'center',
          });
        },
      });
    }
  }

  delete() {
    const selectedData = this.gridApi.getSelectedRows();
  
    let successCount = 0;
    let failureCount = 0;

    const deletionRequests = selectedData.map((data) =>
      this.dataService.deleteData(data.id).toPromise().then(
        () => {
          successCount++;
          // Remove the data from the grid on successful deletion
          this.gridApi.applyTransaction({ remove: [data] });
        },
        () => {
          failureCount++;
        }
      )
    );

    // Wait for all deletion requests to complete
    Promise.all(deletionRequests).then(() => {
      if (failureCount === 0) {
        this.snackBar.open(
          `${successCount} rows deleted successfully!`,
          'OK',
          {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          }
        );
      } else if (successCount === 0) {
        this.snackBar.open(
          'Failed to delete all rows!',
          'Try again!',
          {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          }
        );
      } else {
        this.snackBar.open(
          `Deleted ${successCount} rows successfully. Failed to delete ${failureCount} rows.`,
          'Review',
          {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          }
        );
      }
    });
  }
  
}
