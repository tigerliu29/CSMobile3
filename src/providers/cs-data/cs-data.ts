import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Observable } from "rxjs/Observable";
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of'
import { NativeStorage } from '@ionic-native/native-storage';
import { EC_Success, EC_ExceptionOccured, EC_InvalidRequest } from '../../app/app.module';

/*
  Generated class for the CsDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CsDataProvider {

  readonly BaseAddr = "http://csservice.goyo58.cn:8080";
  readonly LoginAddr = this.BaseAddr + "/User/Login";
  readonly SendRecorverCodeAddr = this.BaseAddr + "/MobilePhoneConfirmCode/Send";
  readonly ResetPasswordAddr = this.BaseAddr + "/User/ResetPassword";

  UserId: string;
  UserIdentity: string;
  LoginPassword: string;
  LoginToken: string;
  LoginUserInfo: LoginUserInfo;

  constructor(
    public http: HttpClient,
    public nativeStorage: NativeStorage,
    public ev: Events
  ) {
    console.log('Hello CsDataProvider Provider');
  }

  Login(uid: string, pwd: string) {
    let request = this.PrepareRequest(new LoginRequest());
    request.UserIdentity = uid;
    request.Password = pwd;
    return this.MakeRequest(SendMobilePhoneConfirmCodeResult, this.LoginAddr, request);
  }

  SendMobilePhoneConfirmCode(phone: string, scenario: string) {
    let request = this.PrepareRequest(new SendMobilePhoneConfirmCodeRequest());
    request.MobilePhoneNumber = phone;
    request.Scenario = scenario;
    return this.MakeRequest(LoginResult, this.SendRecorverCodeAddr, request);
  }

  ResetPassword(phone: string, code: string, pwd: string) {
    let request = this.PrepareRequest(new ResetPasswordRequest());
    request.MobilePhoneNumber = phone;
    request.ConfirmCode = code;
    request.NewPassword = pwd;
    return this.MakeRequest(ResetPasswordResult, this.ResetPasswordAddr, request);
  }

  private PrepareRequest<T extends RequestBase>(request: T): T {
    request.ClientId = "";
    request.ClientType = "建筑同城移动APP";
    request.ClientVersion = "1.0";
    request.ProtocalVersion = "1.0";
    request.UserId = this.UserId;
    request.Token = this.LoginToken;
    return request;
  }

  private MakeRequest<T extends ResultBase>(
    c: new () => T,
    url: string,
    body: any
  ): Observable<T> {
    let result = this.http.post<T>(url, body)
      .pipe(
        catchError(
          error => {
            let r = new c();
            r.ResultCode = EC_ExceptionOccured;
            r.ErrorMessage = error.message;
            return of(r);
          }
        )
      )
      .pipe(
        tap(
          data => {
            if (data.ResultCode == EC_InvalidRequest) {
              this.ev.publish("AuthFails");
            }
          }
        )
      );
    return result;
  }
}

export class ResultBase {
  ErrorMessage: string;
  ResultCode: number;
}

class RequestBase {
  UserId: string;
  Token: string;
  ClientType: string;
  ClientId: string;
  ClientVersion: string;
  ProtocalVersion: string;
}

class LoginRequest extends RequestBase {
  UserIdentity: string;
  Password: string;
}

export class LoginResult extends ResultBase {
  LoginUserInfo: LoginUserInfo;
}

export class UserInfo {
  Id: string;
  NickName: string;
  UserName: string;
  MobilePhoneNumber: string;
  PortraitUrl: string;
  IsOnline: boolean;
  PersonalSignature: string;
  UserCategory: string;
  IconTypes: string[];
  WorkRegionCode: string;
  WeChatOpenId: string;
}

export class LoginUserInfo extends UserInfo {
  LoginToken: string;
}

class SendMobilePhoneConfirmCodeRequest extends RequestBase {
  MobilePhoneNumber: string;
  Scenario: string;
}

export class SendMobilePhoneConfirmCodeResult extends ResultBase {

}

class ResetPasswordRequest extends RequestBase {
  MobilePhoneNumber: string;
  ConfirmCode: string;
  NewPassword: string;
}

export class ResetPasswordResult extends ResultBase{

}