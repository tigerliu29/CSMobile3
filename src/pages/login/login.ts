import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { CsDataProvider } from '../../providers/cs-data/cs-data';
import { HomePage } from '../home/home';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginInfoName } from '../../app/app.module';
import { RecoverPasswordPage } from '../recover-password/recover-password';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  UserIdentity = "";
  Password = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public nativeStorage: NativeStorage,
    public csdata: CsDataProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  DoLogin() {
    console.log('DoLogin');
    let uid = this.UserIdentity.trim();
    if (uid.length == 0 || this.Password.length == 0) {
      let toast = this.toastCtrl.create({
        message: "请输入用户名或密码",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }
    let loader = this.loadingCtrl.create({
      content: "登录..."
    });
    loader.present();
    this.csdata.Login(uid, this.Password)
      .subscribe(
        result => {
          loader.dismiss();
          if (result.ResultCode == 0) {
            this.nativeStorage.setItem(
              LoginInfoName,
              { UserIdentity: this.UserIdentity, Password: this.Password }
            );
            this.navCtrl.setRoot(HomePage, {}, { animate: true, direction: 'forward' });
          }
          else {
            let toast = this.toastCtrl.create({
              message: result.ErrorMessage,
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        }
      );
  }

  GoRegister() {

  }

  GoRecoverPassword() {
    this.navCtrl.push(RecoverPasswordPage);
  }

}
