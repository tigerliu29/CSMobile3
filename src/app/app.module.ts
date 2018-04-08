import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../pages/login/login';
import { CsDataProvider } from '../providers/cs-data/cs-data';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RecoverPasswordPage } from '../pages/recover-password/recover-password';
import { RegisterPage } from '../pages/register/register';
import { IndexPage } from '../pages/index';
import { DocPage } from '../pages/doc/doc';
import { AuthPage } from '../pages/auth/auth';
import { CyclePage } from '../pages/cycle/cycle';
import { PersionPage } from '../pages/persion/persion';
import { ScanModalPage } from '../pages/scan-modal/scan-modal';
import { StimePipe } from '../pipes/stime/stime';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RecoverPasswordPage,
    RegisterPage,
    IndexPage,
    DocPage,
    AuthPage,
    CyclePage,
    PersionPage,
    ScanModalPage,
    StimePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(
      MyApp,
      {
        mode: 'ios',
        backButtonText: '返回',
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthShortNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayShortNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      }
    )
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RecoverPasswordPage,
    RegisterPage,
    IndexPage,
    DocPage,
    AuthPage,
    CyclePage,
    PersionPage,
    ScanModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    NativeStorage,
    HttpClient,
    CsDataProvider,
    InAppBrowser,
    QRScanner
  ]
})
export class AppModule { }

export const LoginInfoName: string = "LoginInfo";
export const EC_Success = 0;           // Error code for success
export const EC_GenericError = -1;     // Error code for generic error
export const EC_InvalidRequest = -2;   // Error code for authentication fails.
export const EC_ExceptionOccured = -3; // Error code for local exception

export const COS_Register = "用户注册";
export const COS_RecoverPassword = "重置密码";