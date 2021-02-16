import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticateService } from 'src/app/authenticate/authenticate.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  name: string
  userData
  constructor(private authService: AuthenticateService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    let userData = JSON.parse(localStorage.getItem('user'))
    this.name = userData.name
    this.userData = userData
  }

  userLogout() {
    this.authService.logout()
    this.router.navigate(['/login'])
  }
  addUsers() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = false
    dialogConfig.height = "500px"
    dialogConfig.autoFocus = true
    dialogConfig.width = "400px"
    this.dialog.open(UserFormComponent, dialogConfig)
  }
}
