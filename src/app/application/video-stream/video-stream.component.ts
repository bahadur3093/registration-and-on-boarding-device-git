import { Component, OnInit, Inject, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { GeneralService } from '../../general.service';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { UsernameValidator } from '../../username.validator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SnackMessageComponent } from '../../common/snack-message/snack-message.component';

@Component({
  selector: 'app-video-stream',
  templateUrl: './video-stream.component.html',
  styleUrls: ['./video-stream.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        visibility: 'hidden',
        'max-height': '0px',
        marginBottom: '0px'
      })),
      state('out', style({
        visibility: 'visible',
        'max-height': '200px',
        marginBottom: '30px'
      })),
      transition('in=>out', animate('500ms')),
      transition('out=>in', animate('500ms'))
    ]),
  ]
})
export class VideoStreamComponent implements OnInit {
  streamData: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  isStartStream: boolean;

  constructor(
    private fb: FormBuilder,
    private gs: GeneralService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.gs.showLoader();
  }

  ngOnInit(): void {
    this.getStreams();
  }
  getStreams() {
    this.gs.getMethod('status').subscribe((res: any) => {
      if (res.status) {
        this.streamData = res;
      } else {
        this.streamData = res;
      }
      this.gs.hideLoader();
    });
  }
  startStream() {
    this.gs.showLoader();
    this.gs.postMethod('start', null).subscribe(res => {
      if (res) {
        const successLogin = 'Stream started successfully!!!';
        this.configureSnakBar(successLogin, 'snack-success');
        this.isStartStream = true;
        this.getStreams();
        this.gs.hideLoader();
      }
    });
  }
  stopStream() {
    this.gs.showLoader();
    this.gs.postMethod('stop', null).subscribe(res => {
      if (res) {
        const successLogin = 'Stream stopped successfully!!!';
        this.configureSnakBar(successLogin, 'snack-success');
        this.isStartStream = false;
        this.getStreams();
        this.gs.hideLoader();
      }
    });
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

  ngAfterViewInit(): void {
    document.getElementById('loader-wrapper').classList.add('isLoaded');
  }

}
