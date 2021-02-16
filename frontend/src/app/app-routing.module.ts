import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, AuthGuard2, AuthGuard3 } from './authenticate/auth.guard';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { HomeComponent } from './home/home.component';
import { InvoiceFormComponent } from './home/invoice/invoice-form/invoice-form.component';
import { UserEditComponent } from './home/user-form/user-edit/user-edit.component';
import { UserFormComponent } from './home/user-form/user-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AuthenticateComponent },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard],

  },
  { path: ':id/edit', component: UserEditComponent, canActivate: [AuthGuard, AuthGuard3] },
  { path: 'invoice/new', component: InvoiceFormComponent, canActivate:[AuthGuard] },
  { path: 'invoice/edit/:id', component: InvoiceFormComponent, canActivate: [AuthGuard] },
  // { path: 'invoice/genpdf/:id', component: GeneratePdfComponent },


  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
