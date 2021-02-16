import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { UserFormComponent } from './home/user-form/user-form.component';
import { UserEditComponent } from './home/user-form/user-edit/user-edit.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { AuthServiceInterceptor } from './authenticate/auth.interceptor.service';
import { ErrorInterceptor } from './authenticate/error.interceptor';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HeaderComponent } from './home/header/header.component';
import { AuthGuard } from './authenticate/auth.guard';
import { AuthGuard2 } from './authenticate/auth.guard';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { InvoiceComponent } from './home/invoice/invoice.component';
// import { InvoiceTableComponent } from './home/invoice/invoice-table/invoice-table.component';
import { MatSortModule } from '@angular/material/sort';
import { InvoiceFormComponent } from './home/invoice/invoice-form/invoice-form.component';
import { InvoiceTableComponent } from './home/invoice/invoice-table/invoice-table.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FooterComponent } from './home/footer/footer.component';
import { MatCheckboxModule } from '@angular/material/checkbox'
//import { MatFormFieldModule } from '@angular/material/form-field';

//import { FlexLayoutModule } from '@angular/flex-layout'


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserFormComponent,
    UserEditComponent,
    AuthenticateComponent,
    HeaderComponent,
    ConfirmationDialogComponent,
    InvoiceComponent,

    InvoiceFormComponent,

    InvoiceTableComponent,

    FooterComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    HttpClientModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatToolbarModule,
    MatCheckboxModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthServiceInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: AuthGuard, useClass: AuthGuard },
    { provide: AuthGuard2, useClass: AuthGuard}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
