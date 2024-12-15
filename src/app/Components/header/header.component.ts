import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router) { }

  home() {
    this.router.navigate(['/home']);
  }

  create() {
    this.router.navigate(['/create']);
  }
  
  // isAuthenticated () : boolean {
  //   return true;
  // }
  
  // login() {
  //   this.router.navigate(['/login']);
  // }

  // register() {
  //   this.router.navigate(['/register']);
  // }

  // logout() {
  //   localStorage.removeItem('token');
  //   this.router.navigate(['/login']);
  // }
}
