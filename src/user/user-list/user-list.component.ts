import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  users!: User[];

  constructor(private userService: UserService, private router: Router,private toastr: ToastrService) {
    if( this.userService.getUsers().length > 0){
        this.users= this.userService.getUsers();
    }else{
      this.userService.startLoader();
      this.userService.getUsersfromAPi().subscribe(users => {
        users.map(a=>this.userService.addUser(a))
        this.users = this.userService.getUsers();
        this.userService.stopLoader();
      });
    }
   
  }

  editUser(id: number): void {
    debugger
    this.router.navigate(['/user/user-upsert'], { queryParams: { id: id } });

  }

  deleteUser(id: number): void {
    this.userService.startLoader();
    this.userService.deleteUser(id);
    this.users = this.userService.getUsers();
    this.userService.stopLoader(); // Reesh user list after deletion
  }
}
