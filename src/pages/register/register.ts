import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { CsDataProvider } from '../../providers/cs-data/cs-data';
import { EC_Success, COS_RecoverPassword, COS_Register } from '../../app/app.module';
import { HomePage } from '../home/home';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  private _PhoneNumber: string = "";

  get PhoneNumber() {
    return this._PhoneNumber.trim();
  }

  set PhoneNumber(value: string) {
    this._PhoneNumber = value;
  }

  get PhoneNumberIsValid() {
    return this.PhoneNumber.length == 11 && parseInt(this.PhoneNumber) != NaN;
  }

  private _UserName: string = "";

  get UserName() {
    return this._UserName.trim();
  }

  set UserName(value: string) {
    this._UserName = value;
  }

  private _NickName: string = "";

  get NickName() {
    return this._NickName.trim();
  }

  set NickName(value: string) {
    this._NickName = value;
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

  get ConfirmCodeIsValid() {
    return this.ConfirmCode.length == 6 && parseInt(this.ConfirmCode) != NaN;
  }

  get PasswordIsValid() {
    return this.Password.length > 0;
  }

  get ConfirmPasswordIsValid() {
    return this.ConfirmPassword.length > 0 && this.Password == this.ConfirmPassword;
  }

  set ConfirmPassword(value: string) {
    this._ConfirmPassword = value;
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
    console.log('ionViewDidLoad RegisterPage');
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

    this.csdata.SendMobilePhoneConfirmCode(this.PhoneNumber, COS_Register)
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

  Register() {

    // if (this.UserName.length == 0) {
    //   let toast = this.toastCtrl.create({
    //     message: "请输用户名",
    //     duration: 3000,
    //     position: 'top'
    //   });
    //   toast.present();
    //   return;
    // }

    // if (parseInt(this.UserName) != NaN) {
    //   let toast = this.toastCtrl.create({
    //     message: "用户名不能是纯数字",
    //     duration: 3000,
    //     position: 'top'
    //   });
    //   toast.present();
    //   return;
    // }

    if (this.Password.length == 0) {
      let toast = this.toastCtrl.create({
        message: "请输入密码",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }

    // if (this.NickName.length == 0) {
    //   let toast = this.toastCtrl.create({
    //     message: "请输入昵称",
    //     duration: 3000,
    //     position: 'top'
    //   });
    //   toast.present();
    //   return;
    // }     

    if (!this.PhoneNumberIsValid) {
      let toast = this.toastCtrl.create({
        message: "请输入合法的手机号码",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }

    if (!this.ConfirmCodeIsValid) {
      let toast = this.toastCtrl.create({
        message: "请输入正确的手机验证码",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }

    if (this.ConfirmPassword.length == 0) {
      let toast = this.toastCtrl.create({
        message: "请输入新账号密码",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }   

    if (this.ConfirmPassword != this.Password) {
      let toast = this.toastCtrl.create({
        message: "两次输入的密码不一致",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }

    let loader = this.loadingCtrl.create({
      content: "注册用户..."
    });
    loader.present();

    this.csdata.Register(this.UserName, this.Password, this.PhoneNumber, this.ConfirmCode, this.NickName)
      .subscribe(
        result => {
          if (result.ResultCode == EC_Success) {
            this.csdata.Login(this.PhoneNumber, this.Password)
              .subscribe(
                result => {
                  loader.dismiss();
                  if (result.ResultCode == EC_Success) {
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
              )
          }
          else {
            loader.dismiss();
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
