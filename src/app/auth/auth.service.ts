import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import Auth, { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Hub } from '@aws-amplify/core';
export interface NewUser {
  email: string,
  phone: string,
  password: string,
  firstName: string,
  lastName: string
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedIn: boolean;
  private userData: any = {};
  private _authState: Subject<CognitoUser | any> = new Subject<CognitoUser | any>();
  authState: Observable<CognitoUser | any> = this._authState.asObservable();

  public static SIGN_IN = 'signIn';
  public static SIGN_OUT = 'signOut';

  constructor(private router: Router) {
    Hub.listen('auth', (data) => {
      const { channel, payload } = data;
      if (channel === 'auth') {
        this._authState.next(payload.event);
      }
    });
  }

  signIn(username: string, password: string): Promise<CognitoUser | any> {
    return new Promise((resolve, reject) => {
      Auth.signIn(username, password)
        .then((user: CognitoUser | any) => {
          this.loggedIn = true;
          resolve(user);
        }).catch((error: any) => reject(error));
    });
  }

  signOut(): Promise<any> {
    return Auth.signOut().then(() => {
      this.loggedIn = false;
      this.router.navigate(['signin']);
    }).catch((error: any) => { console.log(error); });
  }

  signUp(user: NewUser): Promise<CognitoUser|any> {
    return Auth.signUp({
      "username": user.email,
      "password": user.password,
      "attributes": {
        "email": user.email,
        "given_name": user.firstName,
        "family_name": user.lastName,
        "phone_number": user.phone
      }
    });
  }

  updateUserData(user: CognitoUser | any) {
    if (user) {
      this.userData.email = user.attributes.email;
      this.userData.name = user.attributes.given_name;
      this.userData.pid = user.attributes['custom:partition_id'];
      this.userData.username = user.username;
      // this.userData.pid = this.user.getUsername();
      this.userData.familyName = user.attributes.family_name;
      sessionStorage.setItem('userPid', this.userData.pid);
      this.loggedIn = true;
      console.log(this.userData);
    }
  }

  getUserData(): any {
    return this.userData;
  }
}
