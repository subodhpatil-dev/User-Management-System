import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private lastId: number = 0; 
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  private editingUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  editingUser$ = this.editingUserSubject.asObservable();

  constructor( private toastr: ToastrService, private http :HttpClient,private ngxLoader: NgxUiLoaderService) { }
  getUsersfromAPi(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUsers(): User[] {
    return this.users;
  }

  addUser(user: any): void { 

    if(user.id){
    let fullname = user.name.split(' ')
    let userd={
      id: user.id,
      firstName: fullname[0],
      lastName: fullname[1],
      address: user.address.city,
      email: user.email,
      phone: user.phone
    }
      this.users.push(userd);
      this.toastr.success('User Added !');
    }else{
      user.id = ++this.lastId;
      this.users.push(user);
      this.toastr.success('User Added !');
    }
  }

  editUser(updatedUser: User): void {
    const index = this.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      this.toastr.success('User Updated !');
    }
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(user => user.id !== id);
    this.toastr.success('User Deleted !');
  }

  setEditingUser(user: User | null): void {
    this.editingUserSubject.next(user);
  }

  startLoader() {
    this.ngxLoader.start();
  }
  
  // Stop the loader
  stopLoader() {
    this.ngxLoader.stop();
  }
}
