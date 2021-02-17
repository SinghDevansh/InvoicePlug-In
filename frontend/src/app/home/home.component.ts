import { ChangeDetectorRef, Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HomeService } from './home.service';
import { User } from './user.interface';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component'
import { AuthenticateService } from '../authenticate/authenticate.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UserFormComponent } from './user-form/user-form.component';
import { UserEditComponent } from './user-form/user-edit/user-edit.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  @ViewChild(MatSort) sort: MatSort
 //@ViewChild(MatTable) table: MatTable
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selection = new SelectionModel<any>(true, []);
  selectedData
  dataSource:MatTableDataSource<any>
  displayedColumns: string[] = ['select','name', 'action'];
  errorMessage: string = ''
  loading:boolean = false
  id: string
  userEditForm: FormGroup
  editMode = false


  constructor(private homeService: HomeService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetectorRefs: ChangeDetectorRef,
    private dialog: MatDialog,
    private authService: AuthenticateService,
    private toast: ToastrService,
    private elementRef: ElementRef

  ) { }

  ngOnInit() {
    //document.body.className = 'selector'
    let userData = JSON.parse(localStorage.getItem('user'))
    console.log(localStorage.getItem('user'))
    console.log(userData)
      if (userData.isSuperAdmin === true)
        {
          this.onGetUser()
        } else {
          this.errorMessage = 'You are not authorized to View this content'
      }

  }
  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.background = 'linear-gradient(lightgrey,  rgb(209, 218, 214))';
    this.elementRef.nativeElement.ownerDocument.body.backgroundRepeat = 'no-repeat'
 }
  onGetUser() {
    this.loading = true
    this.homeService.getUsers().subscribe(res => {
      //console.log(res)
      this.loading = false
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
      console.log(this.dataSource)

    })
   }

  addNewCreator() {
    // this.router.navigate(['new'], { relativeTo: this.route })
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = false
    dialogConfig.height = "500px"
    dialogConfig.autoFocus = true
    dialogConfig.width = "400px"
    this.dialog.open(UserFormComponent, dialogConfig)

  }
  // createEditForm() {
  //   this.userEditForm = new FormGroup({
  //     name: new FormControl('',[Validators.required]),
  //     email: new FormControl('',[Validators.required, Validators.email]),
  //     password: new FormControl('', [Validators.required]),
  //     selected: new FormControl()
  //   })
  // }
  editUser(id) {
    this.router.navigate([`/${id}/edit`], { relativeTo: this.route })
    this.editMode = true
    //this.table.renderRows()
    //this.ngOnInit()
    // console.log(element)
    // this.createEditForm()
    // this.populateForm(element)
    // const dialogConfig = new MatDialogConfig()
    // dialogConfig.disableClose = false
    // dialogConfig.height = "500px"
    // dialogConfig.autoFocus = true
    // dialogConfig.width = "400px"
    // this.dialog.open(UserEditComponent, dialogConfig)
  }
  // populateForm(element) {
  //   if (element.isSuperAdmin === true)
  //     {
  //       this.userEditForm.setValue({
  //         name: element.name,
  //         email: element.email,
  //         password: element.password,
  //         selected: element.isSuperAdmin
  //       })
  //     } else {
  //       this.userEditForm.setValue({
  //         name: element.name,
  //         email: element.email,
  //         password: element.password,
  //         selected: element.isSalesRep
  //       })
  //     }

  // }
  // updateData(event:any) {
  //   this.dataSource.push(event)
  // }
  // addUserData(event:any) {
  //   this.dataSource.push(event)
  // }
  deleteUser(row) {
    let id = row._id
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
        this.homeService.deleteUser(id).subscribe(res => {
          //console.log(res)
          // this.table.renderRows()
          // this.refreshTable()
          this.toast.success('Deleted user')
          //console.log(row)
          this.dataSource.data = this.dataSource.data.filter((value) =>
            value._id !== id
          )

        })
      }})
  }
  deleteAllUsers() {
    for (let i = 0; i < this.selectedData.length; i++){
      //console.log(this.selectedData[i])
      this.homeService.deleteUser(this.selectedData[i]._id).subscribe((res) => {
        this.dataSource.data = this.dataSource.data.filter((value) =>
            value._id !== this.selectedData[i]._id
          )
        //console.log(res)
        this.toast.success('users deleted')
      })
    }
   // this.dataSource.data = this.selectedData

}
  // private refreshTable() {
  //   // Refreshing table using paginator
  //   // Thanks yeager-j for tips
  //   // https://github.com/marinantonio/angular-mat-table-crud/issues/12
  //   this.paginator._changePageSize(this.paginator.pageSize);
  // }
  /** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  // console.log(numSelected)
   this.selectedData = this.selection.selected

  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}
  /** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
}
}
