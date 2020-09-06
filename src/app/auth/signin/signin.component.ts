import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { GeneralService } from '../../general.service';
import { Router } from '@angular/router';
import { CognitoUser } from '@aws-amplify/auth';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SnackMessageComponent } from '../../common/snack-message/snack-message.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signinForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.min(6)])
  });
  hide = true;
  currentDate: number;
  get emailInput() { return this.signinForm.get('email'); }
  get passwordInput() { return this.signinForm.get('password'); }
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    public auth: AuthService,
    private router: Router,
    private gs: GeneralService,
    private _snackBar: MatSnackBar
  ) {

  }

  getEmailInputError() {
    if (this.emailInput.hasError('email')) {
      return 'Please enter a valid email address.';
    }
    if (this.emailInput.hasError('required')) {
      return 'An Email is required.';
    }
  }

  getPasswordInputError() {
    if (this.passwordInput.hasError('required')) {
      return 'Password is required.';
    }
  }

  ngOnInit(): void {

    this.currentDate = new Date().getFullYear();

  }

  signIn() {
    this.gs.showLoader();
    this.auth.signIn(this.emailInput.value, this.passwordInput.value)
      .then((user: CognitoUser | any) => {
        this.auth.updateUserData(user);
        sessionStorage.setItem('email', user.attributes.email);
        sessionStorage.setItem('userToken', user.signInUserSession.accessToken.jwtToken);
        this.router.navigate(['/', 'gateway']);
        const partitionObject = {
          "pid": sessionStorage.getItem('userPid')
        };
        this.gs.postMethod('login/meta', partitionObject).subscribe(res => {
          if (res) {
            const successLogin = 'Successfully loged in!!!';
            this.configureSnakBar(successLogin, 'snack-success');
            this.gs.hideLoader();
          }
        });
      })
      .catch((error: any) => {
        this.gs.hideLoader();
        switch (error.code) {
          case 'UserNotConfirmedException':
            console.log('User not verified the email');
            this.configureSnakBar(error.message, 'snack-primary');
            break;
          case 'UsernameExistsException':
            this.configureSnakBar(error.message, 'snack-primary');
            break;
          case 'NotAuthorizedException':
            this.configureSnakBar(error.message, 'snack-primary');
            break;
          case 'UserNotFoundException':
            this.configureSnakBar(error.message, 'snack-primary');
            break;

        }
      });
  }
  ngAfterViewInit(): void {
    document.getElementById('loader-wrapper').classList.add('isLoaded');
  }

  configureSnakBar(snackMessage: string, snackType: string) {
    this._snackBar.openFromComponent(SnackMessageComponent, {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: snackType,
      data: {
        message: snackMessage
      }
    });
  }

}
