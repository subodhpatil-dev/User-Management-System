import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../user.service';
@Component({
  selector: 'app-user-upsert',
  templateUrl: './user-upsert.component.html',
  styleUrls: ['./user-upsert.component.scss']
})
export class UserUpsertComponent {
  userForm: FormGroup;
  editingUser!:any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required,Validators.email] ],
      phone: ['', [Validators.required,Validators.pattern(/^\d{10}$/)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        const userId = +id;
        this.editingUser = this.userService.getUsers().find(user => user.id === userId);
        if (this.editingUser) {
          this.userForm.patchValue(this.editingUser);
        } 
      }
    });
  }
  

  onSubmit(): void {
    if (this.userForm.valid) {
      this.userService.startLoader()
      const user: User = this.userForm.value;
      if (this.editingUser) {
        user.id = this.editingUser.id;
        this.userService.editUser(user);
      } else {
        this.userService.addUser(user);
      }
      this.userForm.reset();
      this.router.navigate(['/user/user-list']);
      this.userService.stopLoader();
    }
  }

   

}
