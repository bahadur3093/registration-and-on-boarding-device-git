import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from '../../app/general.service';
import { AuthService } from '../auth/auth.service';


@Component({
    selector: 'app-authenticate-member',
    templateUrl: './authenticatemember.component.html',
    styleUrls: ['./authenticatemember.component.scss']
})
export class AuthenticateMemberComponent implements OnInit {
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private gs: GeneralService,
      public dialog: MatDialog,
      private authService: AuthService) {
    }

    ngOnInit(): void {
      if (this.authService.loggedIn) {
        this.PermissionUser();
      } else {
        this.router.navigate(['/']);
      }
    }

    PermissionUser(): void {
      this.gs.showLoader();
      let user = {};
      user['Email'] = this.authService.getUserData().email;
      /* this.gs.postMethod('user/roledefinitions', user).subscribe((res) => {
        if (res === false) {
          const dialogRef = this.dialog.open(DialogComponent, {
            data: { title: this.ls.getKeyValue('ap-insufficient-user'), content: this.ls.getKeyValue('ap-different-user')}
          });
          dialogRef.afterClosed().subscribe(result => {
            // if(result == "true"){
            this.gs.logout();
            // }
          });
          this.gs.hideLoaderWithDelay(300);
        } else {
          this.router.navigate(['/', 'apps']);
        }
      }); */
      this.router.navigate(['/', 'apps']);
  }
  logout() {
    this.gs.logout();
  }
}
