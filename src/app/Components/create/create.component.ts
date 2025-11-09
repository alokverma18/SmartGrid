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
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
      phone: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
      salary: ['', [Validators.required, Validators.min(0), Validators.max(10000000)]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted:', this.form.value);
      this.dataService.postData(this.form.value).subscribe({
        next: (response) => {
          console.log('Data:', response);
          this.snackBar.open(
            'Data Added Successfully',
            'Done', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          this.form.reset();
        },
        error: (error) => {
          console.error('Error:', error);
          const errorMessage = error.error?.error || 'Failed to add data';
          this.snackBar.open(
            errorMessage,
            'Try again!', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
        }
      });
    } else {
      this.snackBar.open(
        'Please fill all fields correctly',
        'Try again!', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }
  }
}
