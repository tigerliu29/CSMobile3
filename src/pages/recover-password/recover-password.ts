import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { COS_RecoverPassword, EC_Success } from '../../app/app.module';
import { CsDataProvider } from '../../providers/cs-data/cs-data';
import { LoginPage } from '../login/login';

/**
 * Generated class for the RecoverPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-recover-password',
  templateUrl: 'recover-password.html',
})
export class RecoverPasswordPage {

  private _PhoneNumber: string = "";

  get PhoneNumber() {
    return this._PhoneNumber.trim();
  }

  set PhoneNumber(value: string) {
    this._PhoneNumber = value;
  }

  private _ConfirmCode: string = "";

  get ConfirmCode() {
    return this._ConfirmCode;
  }

  set ConfirmCode(value: string) {
    this._ConfirmCode = value;
  }

  private _Password = "";

  get Password() {
    return this._Password;
  }

  set Password(value: string) {
    this._Password = value;
  }

  private _ConfirmPassword = "";

  get ConfirmPassword() {
    return this._ConfirmPassword;
  }

  set ConfirmPassword(value: string) {
    this._ConfirmPassword = value;
  }

  get PhoneNumberIsValid() {
    return this.PhoneNumber.length == 11 && parseInt(this.PhoneNumber) != NaN;
  }

  get ConfirmCodeIsValid() {
    return this.ConfirmCode.length == 6 && parseInt(this.ConfirmCode) != NaN;
  }

  get PasswordIsValid() {
    return this.Password.length > 0;
  }

  get ConfirmPasswordIsValid() {
    return this.ConfirmPassword.length > 0 && this.Password == this.ConfirmPassword;
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public csdata: CsDataProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecoverPasswordPage');
  }

  SendConfirmCode() {
    let phone = this.PhoneNumber.trim();
    if (!this.PhoneNumberIsValid) {
      let toast = this.toastCtrl.create({
        message: "请输入正确的手机号码",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }

    let loader = this.loadingCtrl.create({
      content: "发送验证码..."
    });
    loader.present();

    this.csdata.SendMobilePhoneConfirmCode(this.PhoneNumber, COS_RecoverPassword)
      .subscribe(
        result => {
          loader.dismiss();
          if (result.ResultCode == EC_Success) {
            let toast = this.toastCtrl.create({
              message: "验证码将发送通过短信到您的手机上。",
              duration: 3000,
              position: 'top'
            });
            toast.present();
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

  ResetPassword() {
    if (!this.ConfirmCodeIsValid) {
      let toast = this.toastCtrl.create({
        message: "验证码无效",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }
    else if (!this.PasswordIsValid) {
      let toast = this.toastCtrl.create({
        message: "请输入新密码",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }
    else if (this.ConfirmPassword.length == 0) {
      let toast = this.toastCtrl.create({
        message: "请输入新密码验证",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }
    else if (!this.ConfirmPasswordIsValid) {
      let toast = this.toastCtrl.create({
        message: "两次输入的密码不一致",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }
    else if (!this.PhoneNumberIsValid) {
      let toast = this.toastCtrl.create({
        message: "请输入正确的手机号码",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }

    let loader = this.loadingCtrl.create({
      content: "重置密码..."
    });
    loader.present();

    this.csdata.ResetPassword(this.PhoneNumber, this.ConfirmCode, this.Password)
      .subscribe(
        result => {
          loader.dismiss();
          if (result.ResultCode == EC_Success) {
            let alert = this.alertCtrl.create({
              title: '密码重置成功',
              subTitle: '您的账号密码已成功重置，请返回登录页面使用新的密码登陆。',
              buttons: [
                {
                  text: '返回登录页面',
                  handler: data => {
                    this.navCtrl.setRoot(LoginPage, {}, { animate: true, direction: 'forward' });
                  }
                }
              ]
            });
            alert.present();
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

}
