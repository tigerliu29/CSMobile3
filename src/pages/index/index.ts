import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the IndexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-index',
  templateUrl: 'index.html',
})
export class IndexPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public iab: InAppBrowser,
    public loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndexPage');
  }

  OpenWeb(url: string) {
    const browser = this.iab.create(url, "_blank");
  }

  Goto(target: string) {

    switch (target) {
      case "行业资料":
        this.navCtrl.parent.select(1);
        break;
      case "软件锁":
        this.navCtrl.parent.select(2);
        break;
      case "行业圈":
        this.navCtrl.parent.select(3);
        break;
      case "个人中心":
        this.navCtrl.parent.select(4);
        break;
    }

  }

  TestLoading() {

    let loader = this.loadingCtrl.create({
      content: "获取数据..."
    });
    loader.present();
    this.test();
  }

  async test() {
    await this.sleep(3000)
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }  

}
