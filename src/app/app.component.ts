import { Component, ViewChild } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';

import { HomePage } from '../pages/home/home';
import { LoginInfoName } from './app.module';
import { LoginPage } from '../pages/login/login';
import { NativeService } from '../providers/NativeService';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  @ViewChild('rootnav') nav;

  constructor(
    platform: Platform, statusBar: StatusBar,
    splashScreen: SplashScreen,
    public nativeStorage: NativeStorage,
    public ev: Events,
    private nativeService:NativeService
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      nativeStorage.remove("DocDownloadingList");
      nativeStorage.getItem(LoginInfoName)
        .then(
          data => {
            console.log("发现本地存储中的登陆信息，设置HomePage为主页");
            this.rootPage = HomePage;
    
          },
          error => {
            console.log("未发现本地存储中的登陆信息，设置LoginPage为主页");
            this.rootPage = LoginPage;

          }
        );
      this.nativeService.detectionUpgrade();//检查app是否升级
      splashScreen.hide();
    });
  }

  ngAfterViewInit() {
    this.ev.subscribe("AuthFails", () => {
      console.log("Authentication fails, and set LoginPage as root page.");
      this.nav.setRoot(LoginPage, {}, {animate: true, direction: 'forward'});
    });
  }
}

