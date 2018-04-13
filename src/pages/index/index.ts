import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Slides } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CsDataProvider, IndexBannerSetting } from '../../providers/cs-data/cs-data';
import { EC_Success } from '../../app/app.module';
import { NativeStorage } from '@ionic-native/native-storage';

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

  @ViewChild(Slides) slides: Slides;

  Banners: IndexBannerSetting[] = new Array<IndexBannerSetting>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public iab: InAppBrowser,
    public loadingCtrl: LoadingController,
    public csdata: CsDataProvider,
    public nativeStorage: NativeStorage
  ) {
    let s = new IndexBannerSetting();
    s.TargetUrl = 'https://mp.weixin.qq.com/s?__biz=MzAxNDM4ODY2Ng==&mid=502901965&idx=1&sn=9c375840c475adb7fed7ba880e9d0d97&chksm=0399101834ee990e880109bff430c3a7b3323b59d95c521e871345ee3aea5125f78b7feb358e&mpshare=1&scene=1&srcid=04136Myun7FtbTQWhLaT0ZLI&pass_ticket=Zm%2BSR6L8uvuOTz7wwIT%2FdVjRNcJFlFkETGyb1iOBA3DjtExl3INPoHJRhILc5xFN#rd';
    s.ImageUrl = "http://csservice.goyo58.cn/Images/1.jpg";
    this.Banners.push(s)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndexPage');
    this.nativeStorage.getItem("Banners")
      .then(banners => {
        this.GetIndexBanners()
        if (banners.length > 0) {
          this.ChangeBanners(banners);
        }
      })
      .catch(() => {
        this.GetIndexBanners()
      });      
  }

  ChangeBanners(banners: IndexBannerSetting[]) {
    if(banners.length > 0){
      this.Banners.splice(0, this.Banners.length);
      banners.forEach(b => {
        this.Banners.push(b);
      });
      this.slides.update();
    }
  }

  GetIndexBanners() {
    this.csdata.IndexBanner()
      .subscribe(
        result => {
          let banners: IndexBannerSetting[]
          if (result.ResultCode == EC_Success) {
            banners = result.Banners;
            this.nativeStorage.setItem("banners", banners);
            this.ChangeBanners(banners);
          }
        }
      );
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
