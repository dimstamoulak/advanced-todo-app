import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/all', pathMatch: 'full' },
  { path: 'all', component: HomeComponent },
  { path: 'active', component: HomeComponent },
  { path: 'completed', component: HomeComponent },
];
