import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthService } from '../app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  @Output() loaderStatus: EventEmitter<boolean> = new EventEmitter();
  // baseUrl = window.location.origin;
  baseUrl = 'http://5a916e67b415.ngrok.io/';
  constructor(private http: HttpClient, private authService: AuthService) { }

  // Loader
  showLoader() {
    this.loaderStatus.emit(true);
  }

  hideLoader() {
    this.loaderStatus.emit(false);
  }
  logout() {
    sessionStorage.removeItem('aToken');
    sessionStorage.removeItem('userPid');
    sessionStorage.removeItem('userId');
    // this.adalSvc.logout();
    this.authService.signOut();
  }
  basicHeader() {
    return new HttpHeaders()
      .append('Authorization', 'Bearer ' + sessionStorage.getItem('userToken'))
      .append('Content-Type', 'application/json')
      .append('Ocp-Apim-Trace', 'true')
      .append('userPid', (sessionStorage.email === undefined ? '' : sessionStorage.getItem('userPid')));
  }
  // Post Method
  postMethod(arg, param) {
    this.baseUrl = this.baseUrl.replace(':' + location.port, ':1880/');
    const API_BASE_URL = this.baseUrl;
    return this.http.post(this.baseUrl + arg, param);
  }
  // Get Method
  getMethod(arg) {
    this.baseUrl = this.baseUrl.replace(':' + location.port, ':1880/');
    const API_BASE_URL = this.baseUrl;
    return this.http.get(this.baseUrl + arg, {
      headers: new HttpHeaders()
        .append('Authorization', 'Bearer ' + sessionStorage.getItem('userToken'))
        .append('Content-Type', 'application/json')
        .append('userPid', sessionStorage.getItem('userPid'))
    });
  }
  // Start Stream
  startStream(arg, param) {
    this.baseUrl = this.baseUrl.replace(':' + location.port, ':1880/');
    const API_BASE_URL = this.baseUrl;
    return this.http.post(this.baseUrl + arg, param);
  }
}
