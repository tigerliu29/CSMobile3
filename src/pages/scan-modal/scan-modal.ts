import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, Events } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

/**
 * Generated class for the ScanModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-scan-modal',
  templateUrl: 'scan-modal.html',
})
export class ScanModalPage {

  constructor(    
    public navCtrl: NavController,
    public navParams: NavParams,
    public qrScanner: QRScanner,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public ev: Events
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanModalPage');
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {

          window.document.querySelector('body').classList.add('transparent-body');

          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);            
            this.qrScanner.hide(); 
            scanSub.unsubscribe(); 
            this.navCtrl.pop();
            this.ev.publish("ScannedAuthString", text);
          });

          // show camera preview
          this.qrScanner.show();

          // wait for user to scan something, then the observable callback will be called

        } else if (status.denied) {
          this.ShowCameraDenied();          
        } else {
          this.ShowCameraDenied();
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  ionViewWillLoad(){
    window.document.querySelector('body').classList.remove('transparent-body');
    this.qrScanner.hide();
  }

  ShowCameraDenied(){
    let alert = this.alertCtrl.create({
      title: '没有相机权限',
      subTitle: '您没有授予建筑同城APP使用相机的权限，请在应用管理中授予使用相机的权限后再使用软件锁。',
      buttons: [
        {
          text: '确定',
          handler: data => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

}
