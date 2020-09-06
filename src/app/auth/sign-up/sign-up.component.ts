import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import Auth from '@aws-amplify/auth';
import { CognitoUser } from '@aws-amplify/auth';

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"]
})
export class SignUpComponent implements OnInit {
  hide = true;
  signupForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.email, Validators.required]),
    password: new FormControl("", [Validators.required]),
    phone: new FormControl("", [Validators.min(10)]),
    fname: new FormControl("", [Validators.min(2)]),
    lname: new FormControl("", [Validators.min(2)])
  });
  confirm: boolean = false;

  email:string;
  password:string;
  confirmForm: FormGroup = new FormGroup({
    email: new FormControl({ disabled: true }),
    code: new FormControl('', [Validators.required, Validators.min(3)])
  });
  currentDate: any;

  // countryCode = "+1";

  get emailInput() {
    return this.signupForm.get("email");
  }
  get passwordInput() {
    return this.signupForm.get("password");
  }
  get fnameInput() {
    return '';
  }
  get lnameInput() {
    return '';
  }
  get phoneInput() {
    return '';
  }
  constructor(
    // private _bottomSheet: MatBottomSheet,
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.currentDate = new Date().getFullYear();
  }
  // selectCountryCode() {
  //   this._bottomSheet
  //     .open(CountryCodeSelectComponent)
  //     .afterDismissed()
  //     .subscribe((data: CountryCode) => {
  //       this.countryCode = data ? data.dial_code : this.countryCode;
  //     });
  // }

  getEmailInputError() {
    if (this.emailInput.hasError("email")) {
      return "Please enter a valid email address.";
    }
    if (this.emailInput.hasError("required")) {
      return "An Email is required.";
    }
  }

  getPasswordInputError() {
    if (this.passwordInput.hasError("required")) {
      return "A password is required.";
    }
  }

  shouldEnableSubmit() {
    return (
      !this.emailInput.valid ||
      !this.passwordInput.valid
      // !this.fnameInput.valid ||
      // !this.lnameInput.valid ||
      // !this.phoneInput.valid
    );
  }

  signUp() {
    this._authService
      .signUp({
        email: this.emailInput.value,
        password: this.passwordInput.value,
        firstName: '',
        lastName: '',
        phone: ''
      })
      .then(data => {
        // environment.confirm.email = this.emailInput.value;
        // environment.confirm.password = this.passwordInput.value;
        // this._router.navigate(["confirm"]);
        this.email = this.emailInput.value;
        this.password = this.passwordInput.value;
        this.confirmForm.patchValue({email: this.emailInput.value, disabled: true});
        this.confirm = true;
      })
      .catch(error => console.log(error));
  }

  get codeInput() {
    return this.confirmForm.get('code');
  }
  confirmCode() {
    Auth.confirmSignUp(this.email, this.codeInput.value)
      .then((data: any) => {
        console.log(data);
        if (data === 'SUCCESS' && this.email && this.password){
          this._authService.signIn(this.email, this.password)
            .then((user: CognitoUser | any) => {
              this._authService.updateUserData(user);
              this._router.navigate(['register']);
            }).catch((error: any) => {
              this._router.navigate(['auth/signin']);
            });
        }
      })
      .catch((error: any) => {
        console.log(error);
        // this._notification.show(error.message);
      })
  }
  sendAgain() {
    Auth.resendSignUp(this.email)
  }
}
