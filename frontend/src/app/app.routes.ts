import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { DashboardComponent } from './dashboard/dashboard';
import { StoreListComponent } from './store-list/store-list';
import { StoreFormComponent } from './store-form/store-form';
import { ProductListComponent } from './product-list/product-list';
import { ProductFormComponent } from './product-form/product-form';
import { ProductDetailsComponent } from './product-details/product-details';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'stores', component: StoreListComponent, canActivate: [authGuard] },
  { path: 'stores/new', component: StoreFormComponent, canActivate: [authGuard] },
  { path: 'stores/:id/edit', component: StoreFormComponent, canActivate: [authGuard] },
  { path: 'stores/:storeId/products', component: ProductListComponent, canActivate: [authGuard] },
  { path: 'stores/:storeId/products/new', component: ProductFormComponent, canActivate: [authGuard] },
  { path: 'stores/:storeId/products/:id/edit', component: ProductFormComponent, canActivate: [authGuard] },
  { path: 'stores/:storeId/products/:id', component: ProductDetailsComponent, canActivate: [authGuard] }, // Nouvelle route
  { path: '**', redirectTo: '' }
];