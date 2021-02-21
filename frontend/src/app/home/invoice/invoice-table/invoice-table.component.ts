import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
//import { InvoiceFormComponent } from '../invoice-form/invoice-form.component';
import { InvoiceService } from '../invoice.service';
// import { Invoice } from '../models/invoice.model';

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.css']
})
export class InvoiceTableComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort
  @ViewChild(MatPaginator) paginator:MatPaginator
  dataSource: MatTableDataSource<any>
  selection = new SelectionModel<any>(true, []);
  selectedData

  displayedColumns = ['select','date', 'invoice','recepient','creator','status','Amount','action',];
  constructor(private invoiceService: InvoiceService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private toast:ToastrService) { }

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('user')).isSuperAdmin) {
    this.invoiceService.getAllInvoices().subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      //console.log(this.dataSource)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    }, error => {
        this.toast.error('Unable to load invoices')
    })
    } else {
      this.invoiceService.getInvoices().subscribe(res => {
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
      }, error => {
        this.toast.error('Unable to load invoices')
    })
    }
  }
  editInvoice(element) {

    this.router.navigate([`/invoice/edit/${element._id}`],{relativeTo:this.route})

  }
  deleteInvoice(element) {
    //console.log(element)
    //console.log(this.dataSource.data)
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.invoiceService.deleteInvoice(element).subscribe(res => {

          this.toast.success('Deleted invoice')
          //console.log(row)
          this.dataSource.data = this.dataSource.data.filter((value) =>
            value._id !== element
          )
        }, error => {
            this.toast.error('Unable to delete invoice: Some error occured ')
        })
      }

    })

    this.dataSource.data = this.dataSource.data
  }
  downloadInvoice(invoice) {
    this.invoiceService.genratePdf(invoice)
    //console.log(invoice)
  }
  doFilter(value:Event) {
    this.dataSource.filter = (value.target as HTMLInputElement).value.trim().toLowerCase()
  }
  selectedPaidStatus(value) {

    //console.log(value.trim().toLowerCase())
    this.dataSource.filter = value
  }

/** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;

  this.selectedData = this.selection.selected

  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}
onChange(event){
  //console.log(event.target.value)

  //console.log(this.selectedData)
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    data: {
      message: 'Are you sure want to change status of all Invoices?',
      buttonText: {
        ok: 'Yes',
        cancel: 'No'
      }
    }
  });
  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (confirmed) {
      let selectedStatus = event.target.value
      const selectedDataStatus = this.selectedData
      for(let i =0; i<selectedDataStatus.length;i++){
        let status = selectedDataStatus[i]._id
        this.invoiceService.updateStatus(status, selectedStatus).subscribe((res)=>{
            //console.log(res)
        })
        //console.log(status)
      }
      this.ngOnInit()


    }

  })

  }
  deleteAll() {
    for (let i = 0; i < this.selectedData.length; i++){
      //console.log(this.selectedData[i])
      this.invoiceService.deleteInvoice(this.selectedData[i]).subscribe((res) => {
        this.dataSource.data = this.dataSource.data.filter((value) =>
            value._id !== this.selectedData[i]._id
          )
        //console.log(res)
        this.toast.success('invoices deleted')
      })
    }
   // this.dataSource.data = this.selectedData

}
/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
}
  downloadAll() {
    let downloadData = this.selection.selected
    for (let i = 0; i < downloadData.length; i++){
      this.invoiceService.genratePdf(downloadData[i])
    }
  }
}
