import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../home/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      // id: ['', [Validators.required, Validators.min(1)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      salary: ['', [Validators.required, Validators.min(1000)]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted:', this.form.value);
      this.dataService.postData(this.form.value).subscribe((data) => {
        console.log('Data:', data);
      }
    );
    this.snackBar.open(
      'Data Added Successfully', 
      'Done', {
      duration: 2000,
      verticalPosition: 'top', // Allowed values are  'top' | 'bottom'
      horizontalPosition: 'center', // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right',
    });
    this.form.reset();
    }
  }
}
