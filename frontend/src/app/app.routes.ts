import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { DashboardComponent } from './dashboard/dashboard';
import { StoreListComponent } from './store-list/store-list';
import { StoreFormComponent } from './store-form/store-form';
import { StoreDetailsComponent } from './store-details/store-details';
import { ProductListComponent } from './product-list/product-list';
import { ProductFormComponent } from './product-form/product-form';
import { ProductDetailsComponent } from './product-details/product-details';
import { PublicStoreListComponent } from './public-store-list/public-store-list';
import { PublicProductListComponent } from './public-product-list/public-product-list';
import { PublicProductDetailsComponent } from './public-product-details/public-product-details';
import { PublicStoreDetailsComponent } from './public-store-details/public-store-details';
import { PublicStoreProductsComponent } from './public-store-products/public-store-products';
import { CreateGerantComponent } from './create-gerant-component/create-gerant-component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'public/stores', component: PublicStoreListComponent },
  { path: 'public/products', component: PublicProductListComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'stores', component: StoreListComponent, canActivate: [authGuard] },
  {
    path: 'stores/new',
    component: StoreFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'stores/:id/edit',
    component: StoreFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'stores/:id',
    component: StoreDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'stores/:storeId/products',
    component: ProductListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'stores/:storeId/products/new',
    component: ProductFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'stores/:storeId/products/:id/edit',
    component: ProductFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'stores/:storeId/products/:id',
    component: ProductDetailsComponent,
    canActivate: [authGuard],
  },
  { path: 'public/stores/:id', component: PublicStoreDetailsComponent },
  { path: 'public/products/:id', component: PublicProductDetailsComponent },
  {
    path: 'public/stores/:id/products',
    component: PublicStoreProductsComponent,
  },
  {
    path: 'stores/:id/gerant/new',
    component: CreateGerantComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
