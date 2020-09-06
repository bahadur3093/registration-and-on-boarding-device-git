import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticateMemberComponent } from './authenticatemember/authenticatemember.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { SigninComponent } from './auth/signin/signin.component';
import { GatewayComponent } from './application/gateway/gateway.component';
import { DeviceRegistrationComponent } from './application/device-registration/device-registration.component';
import { VideoStreamComponent } from './application/video-stream/video-stream.component';
import { UnauthGuard } from './auth/unauth.guard';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: SigninComponent,
    canActivate: [UnauthGuard]
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [UnauthGuard]
  },
  {
    path: 'signin',
    component: SigninComponent,
    canActivate: [UnauthGuard]
  },
  {
    path: 'authenticate-member',
    component: AuthenticateMemberComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'gateway',
    component: GatewayComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'device-registration',
    component: DeviceRegistrationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'video-stream',
    component: VideoStreamComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
