import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HomeService } from '../../home.service';
import { User } from '../../user.interface';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  // @Output() onDataUpdate = new EventEmitter<any>()
  userEditForm: FormGroup
  userData: User
  isSuperAdmin = false
  isSalesRep = false
  isAdmin = 'isSuperAdmin'
  isSales = 'isSalesRep'
  id:number
  constructor(private homeService: HomeService,
    private route: ActivatedRoute,
    private router: Router,
  private toast:ToastrService) {
    this.createEditForm()
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id']
      this.getUser(this.id)
    })

    this.getUser(this.id)

  }
  getUser(id: number) {
    this.homeService.getUserById(id).subscribe(res => {
      console.log(res)
      this.userData = res
      if (this.userData.isSuperAdmin === true)
      {
        this.userEditForm.patchValue({
          name: this.userData.name,
          email: this.userData.email,

          selected: this.isAdmin
        })
      } else {
        this.userEditForm.patchValue({
          name: this.userData.name,
          email: this.userData.email,

          selected: this.isSales
        })
      }

    })
  }
  createEditForm() {
    this.userEditForm = new FormGroup({
      name: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      selected: new FormControl()
    })
  }
  onSubmit() {
    this.editUser()
  }
  editUser() {
    let name = this.userEditForm.value.name
    let email = this.userEditForm.value.email
    let password = this.userEditForm.value.password
    if (this.userEditForm.value.selected === 'isSuperAdmin') {
      this.isSuperAdmin = true

    } else {
      this.isSalesRep = true
    }
    this.homeService.editUserRequest(this.id, name, email, password, this.isSuperAdmin, this.isSalesRep)
      .subscribe(res => {
        // console.log(res)
        // this.onDataUpdate.emit(res)
        // console.log('Form Updated')
        this.router.navigate(['/home'], { relativeTo: this.route })
        this.toast.success('User Updated')
      })


  }
  onClear() {
    this.userEditForm.reset()
  }
}
