import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { HomeService } from '../home.service';
import { HomeComponent } from '../home.component';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  // @Output() addData = new EventEmitter<any>()

  isSuperAdmin = false
  isSalesRep = false
  userForm: FormGroup = new FormGroup({
    'name': new FormControl('', [Validators.required]),
    'email': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', [Validators.required]),
    'selected': new FormControl('', [Validators.required]),
  })

  constructor(private homeService: HomeService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<HomeComponent>,
    private dialogSecondRef:MatDialogRef<HeaderComponent>,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
   // document.body.className = 'selector'
  }

  onSubmit() {

    let name = this.userForm.value.name
    let email = this.userForm.value.email
    let password = this.userForm.value.password
    if (this.userForm.value.selected === 'isSuperAdmin') {
      this.isSuperAdmin = true

    } else {
      this.isSalesRep = true
    }
    this.homeService
      .registerUser(name, email, password, this.isSalesRep, this.isSuperAdmin)
      .subscribe(data => {
        //console.log(data)
        this.isSalesRep = false
        this.isSuperAdmin = false
        this.dialogRef.close()
        this.dialogSecondRef.close()
       // this.dialogRef.afterClosed().subscribe(() => this.homeService.getUsers())
        this.toastr.success('User Registered')
       // this.homeService.userDataChanged.next(data)
        // this.addData.emit(data)
        //this.router.navigate(['../'], { relativeTo: this.route })


    })


  }
  onClear() {
    this.userForm.reset()
  }


}
