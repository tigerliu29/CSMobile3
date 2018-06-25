/**
 * Created by xyl by20180531
 */
import { Injectable } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { FileOpener } from '@ionic-native/file-opener';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class NativeService {

  readonly hotMoviesUrl: string = "http://139.129.216.251:12345/version_jztc.json";
  downUrl: string;
  appName: string;
  listData: Object;
  constructor(private platform: Platform,
    private alertCtrl: AlertController,
    private transfer: FileTransfer,
    private appVersion: AppVersion,
    private file: File,
    private fileOpener: FileOpener,
    private http: HttpClient,
    private inAppBrowser: InAppBrowser) {
  }


  /**
   * 检查app是否需要升级
   */
  detectionUpgrade() {
    this.http.get(this.hotMoviesUrl).subscribe(data => {
      //console.log(1);
      this.listData = data;
      this.getVersionNumber().then((value) => {
        let currNum = value;
        let netNum;
        if (this.isAndroid()) {
          netNum = this.listData['Android']['Version'];
          this.appName = this.listData['Android']['AppName'];
          this.downUrl = this.listData['Android']['DownUrl'];
          if (currNum != netNum)
            this.alertCtrl.create({
              title: '升级',
              subTitle: '发现新版本,是否立即升级？',
              buttons: [{ text: '取消' },
              {
                text: '确定',
                handler: () => {
                  this.downloadApp();
                }
              }
              ]
            }).present();

        } else if (this.isIos()) {
          netNum = this.listData['Ios']['Version'];
          this.downUrl = this.listData['Ios']['DownUrl'];
          if (currNum != netNum){                  
              this.alertCtrl.create({
                title: '升级',
                subTitle: '发现新版本,是否立即升级？',
                buttons: [{ text: '取消' },
                {
                  text: '确定',
                  handler: () => {
                    this.openUrlByBrowser(this.downUrl);
                  }
                }
                ]
              }).present();    
          }         
        }
        return value;
      });
    });
  }



  /**
   * 下载安装app
   */
  downloadApp() {
    if (this.isAndroid()) {
      let alertmy = this.alertCtrl.create({
        title: '下载进度：0%',
        enableBackdropDismiss: false,
        buttons: ['后台下载']
      });
      alertmy.present();

      const fileTransfer: FileTransferObject = this.transfer.create();
      const apk = this.file.externalDataDirectory + this.appName; //apk保存的目录
      //alert(apk+this.file.externalDataDirectory);

      // source填写你apk下载的地址
      fileTransfer.download(encodeURI(this.downUrl), apk).then((entry) => {
        this.fileOpener.open(apk, 'application/vnd.android.package-archive');
      }), (error) => {
        alert('由于部分手机出现异常,请您进入手机设置-应用管理-Ceshiname-权限，将存储权限打开后再进行升级，由此给您带来的不便，敬请谅解。');
        for (var item in error) {
          console.log(item + ":" + error[item]);
        }
      };

      fileTransfer.onProgress((event: ProgressEvent) => {
        let num = Math.floor(event.loaded / event.total * 100);
        if (num === 100) {
          alertmy.dismiss();
        } else {
          let title = document.getElementsByClassName('alert-title')[0];
          title && (title.innerHTML = '下载进度：' + num + '%');
        }
      });
    }
    // if (this.isIos()) {
    //   this.openUrlByBrowser("这里边填写下载iOS地址");
    // }
  }

  /**
   * 通过浏览器打开url
   */
  openUrlByBrowser(url: string): void {
    this.inAppBrowser.create(url, '_system');
  }

  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   * @return {boolean}
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   * @return {boolean}
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  /**
   * 获得app版本号,如0.01
   * @description  对应/config.xml中version的值
   * @returns {Promise<string>}
   */
  getVersionNumber(): Promise<string> {
    return new Promise((resolve) => {
      this.appVersion.getVersionNumber().then((value: string) => {
        resolve(value);
      }).catch(err => {
        console.log('getVersionNumber:' + err);
      });
    });
  }
}
