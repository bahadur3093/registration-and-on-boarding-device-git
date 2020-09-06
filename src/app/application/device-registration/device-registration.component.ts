import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { GeneralService } from '../../general.service';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { UsernameValidator } from '../../username.validator';
import { SnackMessageComponent } from 'src/app/common/snack-message/snack-message.component';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-registration',
  templateUrl: './device-registration.component.html',
  styleUrls: ['./device-registration.component.scss'],
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
export class DeviceRegistrationComponent implements OnInit {
  @ViewChild('addNewDeviceTemplate') addNewDeviceTemplate: TemplateRef<any>;
  @ViewChild('registerNewDeviceRef') registerNewDeviceRef: TemplateRef<any>;
  @ViewChild('closeDeviceButton') closeDeviceButton;
  @ViewChild('closeChildDeviceButton') closeChildDeviceButton;
  addNewChildDevice: FormGroup;
  registerNewDeviceForm: FormGroup;
  isRegistered = false;
  deviceData: any = {};
  deviceMetaData: any = {};
  selectedDeviceType: string;
  parentDeviceType: string;
  public slideState = 'in';
  public deviceAttributes = [];
  indexCount: number;
  submitted: boolean;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  selectedChildDeviceType: any;
  childindexCount: number;
  deviceChildAttributes: any[];
  childSubmitted: boolean;
  constructor(
    private fb: FormBuilder,
    private gs: GeneralService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private router: Router) {
    this.gs.showLoader();
    this.getDeviceStatus();
    this.getMetaData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getDeviceStatus();
    this.getMetaData();
  }

  ngOnInit(): void {
    this.registerNewDeviceForm = this.fb.group({
      deviceType: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      attributes: new FormArray([])
    });

    // New Device
    this.addNewChildDevice = this.fb.group({
      name: new FormControl('', Validators.required),
      deviceType: new FormControl('', Validators.required),
      parent_name: new FormControl('', Validators.required),
      description: new FormControl(''),
      attributes: new FormArray([])
    });
  }

  getDeviceStatus() {
    this.gs.getMethod('status').subscribe((res: any) => {
      if (res.status) {
        this.parentDeviceType = res.device_data.type;
        this.deviceData = res;
        this.isRegistered = true;
      } else {
        this.deviceData = res;
        this.isRegistered = false;
      }
      this.gs.hideLoader();
    });
  }

  getMetaData() {
    this.gs.getMethod('metadata').subscribe((res: any) => {
      this.gs.showLoader();
      if (res) {
        this.deviceMetaData = res;
      }
      this.gs.hideLoader();
    });
  }

  onThingsTypeSelect(selectedOption) {
    this.slideState = 'in';
    this.deviceAttributes = [];
    this.getAttributes.clear();
    this.deviceMetaData.deviceTypes[selectedOption.value].forEach((attr) => {
      this.deviceAttributes.push(attr);
      this.getAttributes.push(this.fb.group({
        key: new FormControl(attr.key, [Validators.required, UsernameValidator.cannotContainSpace]),
        defaultValue: new FormControl(attr.defaultValue, [Validators.required, UsernameValidator.cannotContainSpace]),
        optional: new FormControl(attr.optional)
      }));
    });
    this.indexCount = this.deviceAttributes.length;
    this.slideState = 'out';
  }
  onChildThingsTypeSelect(selectedOption) {
    this.slideState = 'in';
    this.deviceChildAttributes = [];
    this.getChildAttributes.clear();
    this.deviceMetaData.deviceTypes[selectedOption.value].forEach((attr) => {
      this.deviceChildAttributes.push(attr);
      this.getChildAttributes.push(this.fb.group({
        key: new FormControl(attr.key, [Validators.required, UsernameValidator.cannotContainSpace]),
        defaultValue: new FormControl(attr.defaultValue, [Validators.required, UsernameValidator.cannotContainSpace]),
        optional: new FormControl(attr.optional)
      }));
    });
    this.childindexCount = this.deviceChildAttributes.length;
    this.slideState = 'out';
  }
  addAttributes() {
    this.getAttributes.push(this.fb.group({
      key: new FormControl('', Validators.required),
      defaultValue: new FormControl('', Validators.required),
      optional: new FormControl(null)
    }));
  }
  addChildAttributes() {
    this.getChildAttributes.push(this.fb.group({
      key: new FormControl('', Validators.required),
      defaultValue: new FormControl('', Validators.required),
      optional: new FormControl(null)
    }));
  }
  removeAttributes(idx) {
    this.getAttributes.removeAt(idx);
  }
  removeChildAttributes(idx) {
    this.getChildAttributes.removeAt(idx);
  }

  // Register device form validations
  get field() {
    return this.registerNewDeviceForm.controls;
  }
  get getAttributes() {
    return this.field.attributes as FormArray;
  }

  // Child Attributes
  get childField() {
    return this.addNewChildDevice.controls;
  }
  get getChildAttributes() {
    return this.childField.attributes as FormArray;
  }

  onDeviceSubmit() {
    this.gs.showLoader();
    this.submitted = true;
    if (this.registerNewDeviceForm.invalid) {
      const invalidForm = 'Check all the fields!!';
      this.configureSnakBar(invalidForm, 'snack-warning');
      return;
    } else {
      let setAttributes = {};
      this.registerNewDeviceForm.value.attributes.forEach((attr) => {
        setAttributes[attr.key] = attr.defaultValue;
      });
      let registerDeviceResp = {
        name: this.registerNewDeviceForm.value.name,
        description: this.registerNewDeviceForm.value.description,
        deviceType: this.registerNewDeviceForm.value.deviceType,
        pid: sessionStorage.getItem('userPid'),
        attributes: setAttributes,
        isGateway: true,
        parentDeviceName: null,
        policyName: 'test_policy_all_actions'
      };
      console.log(registerDeviceResp);
      this.gs.postMethod('register', registerDeviceResp).subscribe((res: any) => {
        if (res) {
          this.slideState = 'in';
          this.addNewChildDevice.controls['parent_name'].setValue(this.deviceData.device_data.type);
          this.deviceData = {};
          const successLogin = 'Device registered!!!';
          this.configureSnakBar(res.message, 'snack-success');
          this.getRegistrationStatus();
          this.closeDeviceButton.nativeElement.click();
        }
      });
    }
  }
  onChildSubmit() {
    this.gs.showLoader();
    this.childSubmitted = true;
    this.addNewChildDevice.controls['parent_name'].setValue(this.deviceData.device_data.type);
    if (this.addNewChildDevice.invalid) {
      const invalidForm = 'Check all the fields!!';
      this.configureSnakBar(invalidForm, 'snack-warning');
      return;
    } else {
      const setAttributes = {};
      this.addNewChildDevice.value.attributes.forEach((attr) => {
        setAttributes[attr.key] = attr.defaultValue;
      });
      const registerChildDeviceResp = {
        name: this.addNewChildDevice.value.name,
        description: this.addNewChildDevice.value.description,
        deviceType: this.addNewChildDevice.value.deviceType,
        pid: sessionStorage.getItem('userPid'),
        attributes: setAttributes,
        isGateway: false,
        parentDeviceName: this.deviceData.device_data.name,
        policyName: 'test_policy_all_actions'
      };
      this.gs.postMethod('register', registerChildDeviceResp).subscribe((res: any) => {
        if (res) {
          this.deviceData = {};
          const successLogin = 'Child device registered!!!';
          this.configureSnakBar(res.message, 'snack-success');
          this.getRegistrationStatus();
          this.closeChildDeviceButton.nativeElement.click();
        }
      });
    }
  }
  getRegistrationStatus() {
    this.gs.getMethod('status').subscribe(res => {
      if (res) {
        this.deviceData = res;
        this.gs.hideLoader();
        this.cdr.detectChanges();
      }
    });
  }
  onReset() {
    this.slideState = 'in';
    this.submitted = false;
    this.getAttributes.clear();
    this.registerNewDeviceForm.reset();
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
