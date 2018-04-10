import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Observable } from "rxjs/Observable";
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of'
import { NativeStorage } from '@ionic-native/native-storage';
import { EC_Success, EC_ExceptionOccured, EC_InvalidRequest, LoginInfoName } from '../../app/app.module';

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
  readonly RegisterUserAddr = this.BaseAddr + "/User/Register";
  readonly GetAuthCodeAddr = this.BaseAddr + "/User/GetAuthCode";
  readonly GetUserDetailsAddr = this.BaseAddr + "/User/GetUserDetails";
  readonly UpdateUserDetailsAddr = this.BaseAddr + "/User/UpdateUserDetails";
  readonly GetPostRecords2Addr = this.BaseAddr + "/Post/GetPostRecords2";
  readonly NewPostAddr = this.BaseAddr + "/Post/NewPost";
  readonly NewReplyAddr = this.BaseAddr + "/Post/NewReply";
  readonly GetPostRepliesAddr = this.BaseAddr + "/Post/GetPostReplies";
  readonly DeletePostAddr = this.BaseAddr + "/Post/DeletePost";
  readonly DocumentListAddr = this.BaseAddr + "/Document/Index";

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
    console.log("UID:" + uid + "\tPWD:" + pwd)
    let request = this.PrepareRequest(new LoginRequest());
    request.UserIdentity = uid;
    request.Password = pwd;
    return this.MakeRequest(LoginResult, this.LoginAddr, request)
      .pipe(
        tap(result => {
          if (result.ResultCode == EC_Success) {
            this.UserId = result.LoginUserInfo.Id;
            this.UserIdentity = request.UserIdentity;
            this.LoginPassword = request.Password;
            this.LoginToken = result.LoginUserInfo.LoginToken;
            this.LoginUserInfo = result.LoginUserInfo;
            console.log("Write LoginInfo")
            this.nativeStorage.setItem(LoginInfoName, { UserIdentity: request.UserIdentity, Password: request.Password });
          }
          else {
            this.UserId = null;
            this.UserIdentity = null;
            this.LoginPassword = null;
            this.LoginToken = null;
            this.LoginUserInfo = null;
            this.nativeStorage.remove(LoginInfoName);
          }
        })
      );
  }

  SendMobilePhoneConfirmCode(phone: string, scenario: string) {
    let request = this.PrepareRequest(new SendMobilePhoneConfirmCodeRequest());
    request.MobilePhoneNumber = phone;
    request.Scenario = scenario;
    return this.MakeRequest(SendMobilePhoneConfirmCodeResult, this.SendRecorverCodeAddr, request);
  }

  ResetPassword(phone: string, code: string, pwd: string) {
    let request = this.PrepareRequest(new ResetPasswordRequest());
    request.MobilePhoneNumber = phone;
    request.ConfirmCode = code;
    request.NewPassword = pwd;
    return this.MakeRequest(ResetPasswordResult, this.ResetPasswordAddr, request);
  }

  Register(userName: string, pwd: string, phone: string, code: string, nickname: string) {
    let request = this.PrepareRequest(new RegisterUserRequest());
    request.UserName = userName;
    request.NickName = nickname;
    request.MobilePhoneNumber = phone;
    request.MobilePhoneConfirmCode = code;
    request.Password = pwd;
    return this.MakeRequest(RegisterUserResult, this.RegisterUserAddr, request);
  }

  GetAuthCode(authStr: string) {
    let request = this.PrepareRequest(new GetAuthCodeRequest());
    request.AuthString = authStr;
    return this.MakeRequest(GetAuthCodeResult, this.GetAuthCodeAddr, request);
  }

  GetPostRecords(getNew: boolean, tagids: string[], rcodes: string[], pattern: string, replyids: number[], sgroup: string, lastpid: number, lastptitme: string) {
    let request = this.PrepareRequest(new GetPostRecords2Request());
    request.GetNew = getNew;
    request.RegionCodes = rcodes;
    request.TagGuids = tagids;
    request.LastPostId = lastpid;
    request.LastPostTime = lastptitme;
    request.PostReplyIds = replyids;
    request.MaxCount = 20;
    request.MaxReplyCount = 1024;
    request.SearchPattern = pattern;
    return this.MakeRequest(GetPostRecords2Result, this.GetPostRecords2Addr, request)
      .pipe(
        tap(
          result => {
            result.PostRecords
              .forEach(
                pr => {
                  pr.PublishTimeObj = this.GetDate(pr.PublishTime);
                  pr.Replies
                    .forEach(
                      rr => {
                        rr.ReplyTimeObj = this.GetDate(rr.ReplyTime);
                      }
                    );
                }
              );
          }
        )
      );;
  }

  GetUserDetails(id: string) {
    let request = this.PrepareRequest(new GetUserDetailsRequest());
    request.Id = id;
    return this.MakeRequest(GetUserDetailsResult, this.GetUserDetailsAddr, request)
      .pipe(
        tap(
          r => {
            if (r.UserDetails.Birthday != null)
              r.UserDetails.Birthday = this.DateDeltaString(this.GetDate(r.UserDetails.Birthday));
            else
              r.UserDetails.Birthday = null;
          }
        )
      );
  }

  UpdateUserDetails(details: UserDetailsInfo) {
    let request = this.PrepareRequest(new UpdateUserDetailsRequest());
    request.UserDetails = details;
    return this.MakeRequest(GetUserDetailsResult, this.GetUserDetailsAddr, request)
      .pipe(
        tap(
          r => {
            if (r.UserDetails.Birthday != null)
              r.UserDetails.Birthday = this.DateDeltaString(this.GetDate(r.UserDetails.Birthday));
            else
              r.UserDetails.Birthday = null;
          }
        )
      );
  }

  public NewReply(postid: number, content: string, uid: string) {
    let request = this.PrepareRequest(new NewReplyRequest());
    request.UserId = uid;
    request.Content = content;
    request.PostRecordId = postid;
    return this.MakeRequest(NewReplyResult, this.NewReplyAddr, request);
  }

  public NewPost(zyid: string, typeid: string, regionCode: string, content: string) {
    let request = this.PrepareRequest(new NewPostRequest());
    request.Content = content;
    request.RegionCode = regionCode;
    request.TagIds = new Array<string>(zyid, typeid);
    return this.MakeRequest(NewPostResult, this.NewPostAddr, request);
  }

  public DeletePost(id: number) {
    let request = this.PrepareRequest(new DeletePostRequest());
    request.PostId = id;
    return this.MakeRequest(DeletePostResult, this.DeletePostAddr, request);
  }

  public GetReply(getnew: boolean, postid: number, lastid?: number, lasttime?: string) {
    let request = this.PrepareRequest(new GetPostRepliesRequest());
    request.GetNew = getnew;
    request.LastReplyId = lastid;
    request.LastReplyTime = lasttime;
    request.MaxCount = 100;
    request.PostId = postid;
    return this.MakeRequest(GetPostRepliesResult, this.GetPostRepliesAddr, request);
  }

  public DogumentList(dir: string) {
    let request = this.PrepareRequest(new DocumentListRequest());
    request.Directory = dir;
    return this.MakeRequest(DocumentListResult, this.DocumentListAddr, request);
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
            if (data.ResultCode == EC_InvalidRequest && data.ErrorMessage == "无效的身份验证信息") {
              this.ev.publish("AuthFails");
            }
          }
        )
      );
    return result;
  }

  GetDate(str: string) {
    let date = new Date(parseInt(str.replace("/Date(", "").replace(")/", ""), 10));
    return date;
  }

  DateDeltaString(date: Date) {
    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    let delta = date.getTime() - today.getTime();
    if (delta > 0 && delta < 1000 * 60 * 60 * 24) {
      return (date.getHours()) + ":" + (date.getMinutes());
    }
    else if (today.getFullYear == date.getFullYear) {
      return (date.getMonth() + 1) + "月" + (date.getDate()) + "日";
    }
    else {
      return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + (date.getDate()) + "日";
    }
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

export class ResetPasswordResult extends ResultBase {

}

class RegisterUserRequest extends RequestBase {
  MobilePhoneConfirmCode: string;
  MobilePhoneNumber: string;
  NickName: string;
  Password: string;
  UserName: string
}

export class RegisterUserResult extends ResultBase {

}

class GetAuthCodeRequest extends RequestBase {
  AuthString: string;
}

export class GetAuthCodeResult extends ResultBase {
  AuthCode: string;
}

class GetUserDetailsRequest extends RequestBase {
  Id: string;
}

export class GetUserDetailsResult extends ResultBase {
  UserDetails: UserDetailsInfo;
}

export class UserDetailsInfo extends UserInfo {
  Birthday: string;
  Email: string;
  Sex: string;
  RealName: string;
  College: string;
  Education: string;
  Certificates: string;
  WorkYears: string;
  WorkNature: string;
  WorkSpeciality: string;
  UserWorkInfos: UserWorkInfo[];
}

export class UserWorkInfo {
  Id: number;
  WorkType: string;
  WorkSpecialization: string;
  WorkTime: string;
}

class UpdateUserDetailsRequest extends RequestBase {
  UserDetails: UserDetailsInfo;
}

export class UpdateUserDetailsResult extends ResultBase {
  NewUserDetails: UserDetailsInfo;
}

class GetPostRecords2Request extends RequestBase {
  MaxCount: number;
  MaxReplyCount: number;
  LastPostId: number;
  LastPostTime: string;
  GetNew: boolean;
  TagGuids: string[];
  RegionCodes: string[];
  SearchPattern: string;
  PostReplyIds: number[];
  SearchGroup: string;
}

export class GetPostRecords2Result extends ResultBase {
  PostRecords: PostRecordInfo[];
  Regions: RegionInfo[];
  PostTags: PostTagInfo[];
}

export class PostTagInfo {
  Id: string;
  Category: string;
  Name: string;
  DisplayName: string;
  Explanation: string;
  TagCategory: string;
}

export class RegionInfo {
  Code: string;
  Name: string;
  FullName: string;
}

export class PostRecordInfo {
  Id: number;
  Content: string;
  OwnerId: string;
  OwnerNickName: string;
  OwnerPortraitUrl: string;
  PublishTime: string;
  PublishTimeObj: Date;
  ReplyCount: number;
  ImageUrls: string[];
  Tags: PostTagInfo[];
  Regions: RegionInfo[];
  PostContentType: string;
  PostContentTypeExtraData: string;
  ExternUrl: string;
  ExternUrlTitle: string;
  IconTypes: string[];
  Replies: PostReplyInfo[];
}

export class PostReplyInfo {
  Id: number;
  PostRecordId: number;
  Content: string;
  ReplyTime: string;
  ReplyTimeObj: Date;
  ReplyUserId: string;
  ReplyUserNickName: string;
  ReplyUserPortraitUrl: string;
  IconTypes: string[];
}

class NewReplyRequest extends RequestBase {
  PostRecordId: number;
  Content: string;
  TargetUserId: string;
}

export class NewReplyResult extends ResultBase {

}

class GetPostRepliesRequest extends RequestBase {
  PostId: number;
  LastReplyTime?: string;
  LastReplyId?: number;
  MaxCount: number;
  GetNew: boolean;
}

export class GetPostRepliesResult extends ResultBase {
  Replies: PostReplyInfo[];
}

class NewPostRequest extends RequestBase {
  Content: string;
  TagIds: string[];
  ImageFileNames: string[];
  RegionCode: string;
  ExternUrl: string;
  ExternUrlTitle: string;
}

export class NewPostResult extends ResultBase {

}

class DeletePostRequest extends RequestBase {
  PostId: number;
}

export class DeletePostResult extends ResultBase {
  PostId: number;
}

class DocumentListRequest extends RequestBase {
  Directory: string;
}

export class DocumentListResult extends ResultBase {
  Dirs: string[];
  Files: string[];
}