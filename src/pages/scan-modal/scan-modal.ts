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
    this.canvasLoad();
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

  ionViewWillLeave(){
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

  canvasLoad(){
    var canvas = document.createElement('canvas');
    var context = canvas.getContext("2d");
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

    context.lineWidth = 1;  
    var qc_x=65;
    var qrCodeWidth=canvas.width-qc_x-qc_x;
    var qc_y=canvas.height/2-100; 
    var qrcodeheight=200;

    context.fillStyle = 'rgba(0,0,0,0.5)'; 
    context.fillRect(0,0,canvas.width,canvas.height);//填充背景我色
    context.clearRect(qc_x,qc_y,qrCodeWidth,qrcodeheight);//抠出一个矩形区域
    context.beginPath();  
    context.strokeStyle="rgb(148,217,81)";   
    context.moveTo(qc_x,qc_y);  
    context.lineTo(qrCodeWidth+qc_x,qc_y);//上
    context.lineTo(qrCodeWidth+qc_x,qc_y+qrcodeheight);//右 
    context.lineTo(qc_x,qc_y+qrcodeheight);//下   
    context.lineTo(qc_x,qc_y);//左   
    context.closePath(); 
    context.stroke(); 
    document.getElementById('allscan').appendChild(canvas);
    
    context.lineWidth = 3.6; 
    var rectAngleWidth=30;
    var rectAngpadding=1.6;
   
    //左

    context.beginPath();   
    context.strokeStyle="rgb(148,217,81)";   
    context.moveTo(qc_x,qc_y);  
    context.lineTo(qc_x+rectAngleWidth,qc_y);
    context.closePath(); 
    context.stroke();
   // context.lineWidth = 4.8; 
    context.beginPath();   
    context.strokeStyle="rgb(148,217,81)";   
    context.moveTo(qc_x,qc_y-rectAngpadding);  
    context.lineTo(qc_x,qc_y+rectAngleWidth);
    context.closePath(); 
    context.stroke();   
    
    //右
    context.beginPath();  
   // context.lineWidth = 4; 
    context.strokeStyle="rgb(148,217,81)";   
    context.moveTo(qrCodeWidth+qc_x-rectAngleWidth,qc_y);
    context.lineTo(qrCodeWidth+qc_x,qc_y);
    context.closePath(); 
    context.stroke();
    //context.lineWidth = 4.8; 
    context.beginPath();  
    context.strokeStyle="rgb(148,217,81)";   
    context.moveTo(qrCodeWidth+qc_x,qc_y-rectAngpadding);
    context.lineTo(qrCodeWidth+qc_x,qc_y+rectAngleWidth);
    context.closePath(); 
    context.stroke();   

    //下右
    //context.lineWidth = 4.8; 
    context.beginPath();  
    context.strokeStyle="rgb(148,217,81)";   
    context.moveTo(qc_x+qrCodeWidth,qc_y+qrcodeheight+rectAngpadding);
    context.lineTo(qc_x+qrCodeWidth,qc_y+qrcodeheight-rectAngleWidth);
    context.closePath(); 
    context.stroke();
    //context.lineWidth = 4; 
    context.beginPath();  
    context.strokeStyle="rgb(148,217,81)";   
    context.moveTo(qc_x+qrCodeWidth,qc_y+qrcodeheight);
    context.lineTo(qc_x+qrCodeWidth-rectAngleWidth,qc_y+qrcodeheight);
    context.closePath(); 
    context.stroke();  
    
    //下左 
    //context.lineWidth = 4.8; 
    context.beginPath();  
    context.strokeStyle="rgb(148,217,81)";   
    context.moveTo(qc_x,qc_y+qrcodeheight+rectAngpadding);
    context.lineTo(qc_x,qc_y+qrcodeheight-rectAngleWidth);
    context.closePath(); 
    context.stroke();
   // context.lineWidth = 4; 
    context.beginPath();  
    context.strokeStyle="rgb(148,217,81)";   
    context.moveTo(qc_x,qc_y+qrcodeheight);
    context.lineTo(qc_x+rectAngleWidth,qc_y+qrcodeheight);
    context.closePath(); 
    context.stroke();     

    var h=0;
    var currh=0;
    var qcspeed=20;
    var paddingline=6;
    context.lineWidth = 1; 
    window.setInterval(function(){
      if(h==qrcodeheight-paddingline-paddingline-2)
        h=0;
      else{
        if(h!=0)
           context.clearRect(qc_x+paddingline,qc_y+paddingline,qrCodeWidth-paddingline-paddingline,qrcodeheight-paddingline-paddingline);
        h++;
        currh=qc_y+h+paddingline;
        context.beginPath();  
        context.strokeStyle="rgb(0,122,204)";   
        context.moveTo(qc_x+paddingline,currh);  
        context.lineTo(qc_x+qrCodeWidth-paddingline,currh);//上       
        context.stroke(); 
        context.closePath();
      } 
    },qcspeed);
  }
}
