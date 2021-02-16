import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticateService } from './authenticate.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {
  hide: boolean = true;
  errorMessage = ''
  responseData
  returnUrl: string;

  constructor(private fb: FormBuilder,
    private authService: AuthenticateService,
    private route: ActivatedRoute,
    private router: Router,
  private toast:ToastrService,private elementRef: ElementRef) {
  }

  ngOnInit() {
    //this.returnUrl = this.route.snapshot.queryParams['returnUrl']
  }
  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.background = 'linear-gradient(lightgrey,  rgb(209, 218, 214))';
    this.elementRef.nativeElement.ownerDocument.body.backgroundRepeat = 'no-repeat'
 }

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })


  onLogin() {
    if (!this.loginForm.valid) {
      return;
    }
    const email = this.loginForm.value.email
    const password = this.loginForm.value.password
    this.authService.login(email, password).subscribe(res => {
      console.log('Logged In !!')
      //console.log(res)
      this.responseData = res
      if (this.responseData.body.message)
      {
        this.errorMessage = this.responseData.body.message
        this.toast.error(this.errorMessage)
        this.loginForm.reset()
        //console.log(this.errorMessage)
      } else {
        //let id = this.responseData.body.id
        //console.log(this.returnUrl)
        this.router.navigate(['/home'], { relativeTo: this.route })
        this.toast.success('Welcome')
      }
    })
  }

}
