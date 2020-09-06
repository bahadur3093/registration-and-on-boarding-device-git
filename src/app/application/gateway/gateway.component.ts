import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gateway',
  templateUrl: './gateway.component.html',
  styleUrls: ['./gateway.component.scss']
})
export class GatewayComponent implements OnInit {

  constructor(
    private router: Router
    ) { }

  ngOnInit(): void {

  }

  cloudNVR(): void {
    this.router.navigate(['/', 'device-registration']);
  }

  ngAfterViewInit(): void {
    document.getElementById('loader-wrapper').classList.add('isLoaded');
  }
}
