import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../app/general.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  showLoader: any;

  constructor(private gs: GeneralService) { }

  ngOnInit(): void {
    this.gs.loaderStatus.subscribe(val => {
      this.showLoader = val;
    });
  }

}
