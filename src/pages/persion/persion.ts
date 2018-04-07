import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { CsDataProvider, UserDetailsInfo } from '../../providers/cs-data/cs-data';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../login/login';

/**
 * Generated class for the PersionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-persion',
  templateUrl: 'persion.html',
})
export class PersionPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public nativeStorage: NativeStorage,
    public csdata: CsDataProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
  }

  UserDetails: UserDetailsInfo = new UserDetailsInfo();
  OldUserDetails: UserDetailsInfo = new UserDetailsInfo();

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersionPage');
  }

  ionViewDidEnter(){
    let loader = this.loadingCtrl.create({
      content: "正在获取数据..."
    });
    loader.present();
    this.csdata.GetUserDetails(this.csdata.UserId)
      .subscribe(r => {
        loader.dismiss();
        if (r.ResultCode != 0) {
          let toast = this.toastCtrl.create({
            message: r.ErrorMessage,
            duration: 3000,
            position: 'top'
          });
          this.UserDetails = JSON.parse(JSON.stringify(this.OldUserDetails));
          toast.present();
        }
        else {
          this.UserDetails = r.UserDetails;
          this.OldUserDetails = JSON.parse(JSON.stringify(this.UserDetails));
        }
      });
  }

  ChangeRealName() {

  }

  ChangeEmail() {

  }

  ChangeNickName() {

  }

  ChangeSex() {

  }

  ChangeBirthday() {

  }

  ChangeCollege() {

  }

  ChangeEducation() {

  }

  ChangeCertificates() {

  }

  ExitLogin() {
    this.csdata.LoginUserInfo = null;
    this.nativeStorage.remove("LoginInfo");
    this.navCtrl.parent.parent.setRoot(LoginPage, {}, { animate: true, direction: 'forward' });
  }

}
