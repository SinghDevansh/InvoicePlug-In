import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
  }
  openForm() {
    // const dialogConfig = new MatDialogConfig()
    // dialogConfig.disableClose = false
    // dialogConfig.height = "600px"
    // dialogConfig.autoFocus = true
    // dialogConfig.width = "1000px"
    // this.dialog.open(InvoiceFormComponent, dialogConfig)
    this.router.navigate(['/invoice/new'],{relativeTo:this.route})
  }

}
