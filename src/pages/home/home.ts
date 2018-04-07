import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { CsDataProvider } from '../../providers/cs-data/cs-data';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginInfoName } from '../../app/app.module';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

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
                  if (result.ResultCode != 0) {
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
