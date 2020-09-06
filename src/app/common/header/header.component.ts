import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../general.service';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  faCoffee = faCoffee;
  userEmail: string;
  constructor(
    private gs: GeneralService
    ) {
     }

  ngOnInit(): void {
    this.userEmail = sessionStorage.getItem('email');
  }
  logout() {
    this.gs.logout();
  }

}
