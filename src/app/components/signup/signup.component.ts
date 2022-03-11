import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm = new FormGroup({
    username: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.minLength(8),
      Validators.maxLength(30),
      Validators.pattern(
        '(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}'
      ),
      Validators.required,
    ]),
  });
  loginInvalid = false;
  showPassword = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {}

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.http
      .post<any>('http://localhost:3000/signupUsers', this.signupForm.value)
      .subscribe(
        (res: any) => {
          alert('SignUp successfull');
          this.signupForm.reset();
          this.router.navigate(['login']);
        },
        (err) => {
          alert('Something went wrong');
        }
      );
  }
}
