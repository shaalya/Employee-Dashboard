import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordStrengthValidator } from 'src/app/directives/custom-validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(30),
      Validators.pattern(
        '(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}'
      ),
      Validators.required,
      passwordStrengthValidator(),
    ]),
  });

  loginInvalid = false;
  username: any;
  passwordStrength: any;
  public showPassword: boolean = false;
  constructor(private http: HttpClient, public router: Router) {}

  ngOnInit(): void {
    if (this.loginForm.controls.password.errors) {
      this.passwordStrength = {
        hasUpperCase: true,
        hasLowerCase: true,
        hasNumeric: false,
      };
    }
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.http.get('http://localhost:3000/signupUsers').subscribe(
      (res: any) => {
        const user = res.find((v: any) => {
          this.username = v.username;
          return (
            v.username === this.loginForm.value.username &&
            v.password === this.loginForm.value.password
          );
        });
        if (user) {
          alert('Login successfull');
          this.loginForm.reset();
          this.router.navigate(['dashboard'], {
            state: { username: this.username },
          });
        } else {
          alert('User not found');
        }
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }
}
