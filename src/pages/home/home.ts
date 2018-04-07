import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { CsDataProvider } from '../../providers/cs-data/cs-data';
import { NativeStorage } from '@ionic-native/native-storage';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { LoginInfoName, EC_Success } from '../../app/app.module';
import { LoginPage } from '../login/login';
import { IndexPage } from '../index';
import { DocPage } from '../doc/doc';
import { AuthPage } from '../auth/auth';
import { CyclePage } from '../cycle/cycle';
import { PersionPage } from '../persion/persion';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Slides) slides: Slides;

  indexRoot = IndexPage;
  docRoot = DocPage;
  authRoot = AuthPage;
  cycleRoot = CyclePage
  personRoot = PersionPage;

  constructor(
    public navCtrl: NavController,
    public nativeStorage: NativeStorage,
    public loadingCtrl: LoadingController,
    public csdata: CsDataProvider
  ) {
  }

  ionViewWillEnter() {
    if (this.csdata.LoginUserInfo == null) {
      this.nativeStorage.getItem(LoginInfoName)
        .then(
          data => {
            let loader = this.loadingCtrl.create({
              content: "登录..."
            });
            loader.present();
            this.csdata.Login(data.UserIdentity, data.Password)
              .subscribe(
                result => {
                  loader.dismiss();
                  if (result.ResultCode != EC_Success) {
                    this.navCtrl.setRoot(LoginPage, {}, { animate: true, direction: 'forward' });
                  }
                }
              );
          },
          error => {
            this.navCtrl.setRoot(LoginPage, {}, { animate: true, direction: 'forward' });
          }
        );
    }
  }
}
