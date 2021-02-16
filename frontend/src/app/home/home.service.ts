import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { User } from "./user.interface";
import { map } from 'rxjs/operators'
import { Subject } from "rxjs";


@Injectable({
  providedIn:'root'
})
export class HomeService{
  private ROOT_URL: string = environment.APP_URL
  private userDataChanged = new Subject<any>()
  // userDataChanged$ = this.userDataChanged.asObservable()
  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<User[]>(`${this.ROOT_URL}/api/users/getusers`)
    //this.userDataChanged.next(data)
  }
  registerUser(name: string,
    email: string,
    password: string,
    isSalesRep: boolean,
    isSuperAdmin: boolean) {
    const userData = {
      name: name,
      email: email,
      password: password,
      isSalesRep: isSalesRep,
      isSuperAdmin: isSuperAdmin
    }
    return this.http.post<User>(`${this.ROOT_URL}/api/users/adduser`,  userData )
  }
  getUserById(id:number) {
    return this.http.get<User>(`${this.ROOT_URL}/api/users/${id}`)
      .pipe(map(res => {
        return res
      }))
  }
  editUserRequest(
    id:number,
    name: string,
    email: string,
    password: string,
    isSuperAdmin: boolean,
    isSalesRep: boolean) {
    const userUpdatedData = {
      name:name,
      email: email,
      password: password,
      isSuperAdmin: isSuperAdmin,
      isSalesRep: isSalesRep
    }
    return this.http.put(`${this.ROOT_URL}/api/users/${id}`, userUpdatedData)

  }
  deleteUser(id: number) {
    return this.http.delete(`${this.ROOT_URL}/api/users/${id}`)

  }
  }


