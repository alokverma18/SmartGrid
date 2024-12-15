import { Routes } from '@angular/router';
import { AuthGuard } from './Components/auth/auth.guard';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/auth/login/login.component';
import { RegisterComponent } from './Components/auth/register/register.component';
import { CreateComponent } from './Components/create/create.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',  /* Redirect to /home */
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'create',
    component: CreateComponent,
  }
];


