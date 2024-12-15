import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  role = 'reader'; // Default role selection
  constructor(
    private authService: AuthService,
    private router: Router) {
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      if (this.authService.getUserRole() === 'reader') {
        this.router.navigate(['/reader']);
      } else if (this.authService.getUserRole()  === 'owner') {
        this.router.navigate(['/owner']);
      }
    }
  }

  login(event: Event) {
    event.preventDefault();
    console.log(`Login: ${this.email} / ${this.password} as ${this.role}`);
    this.authService
    .login({
      email: this.email,
      password: this.password,
      role: this.role,  // Include role
    })
      .subscribe((response: any) => {
        // alert('Login success!');
        if (this.role === 'reader') {
          this.router.navigate(['/reader']);
        } else if (this.role === 'owner') {
          this.router.navigate(['/owner']);
        }
      }, (error) => {
        // alert('Login failed!');
        console.error(error);
      });
  }
}

