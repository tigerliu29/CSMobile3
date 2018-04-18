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

  Banners2: IndexBannerSetting[] = new Array<IndexBannerSetting>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public iab: InAppBrowser,
    public loadingCtrl: LoadingController,
    public csdata: CsDataProvider,
    public nativeStorage: NativeStorage
  ) {
    this.Banners2.push(
      new IndexBannerSetting(
        "assets/imgs/4.jpg",
        "http://mp.weixin.qq.com/s/QH8XgDnvXmz7iQ-IP5OuCA"
      )
    );
    this.Banners2.push(
      new IndexBannerSetting(
        "assets/imgs/5.jpg",
        "http://mp.weixin.qq.com/s/tZUe-2b6Vq7bWUKSlBk_hg"
      )
    );
    this.Banners2.push(
      new IndexBannerSetting(
        "assets/imgs/1.jpg",
        ""
      )
    );
    this.Banners2.push(
      new IndexBannerSetting(
        "assets/imgs/2.jpg",
        ""
      )
    );
    this.Banners2.push(
      new IndexBannerSetting(
        "assets/imgs/3.jpg",
        ""
      )
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndexPage');
    this.nativeStorage.getItem("Banners2")
      .then(banners => {
        this.GetIndexBanners();
        if (banners.length > 0) {
          this.ChangeBanners(banners);
        }
      })
      .catch(() => {
        this.GetIndexBanners()
      });
  }

  ChangeBanners(banners: IndexBannerSetting[]) {
    if (banners.length > 0) {
      this.Banners2.splice(0, this.Banners2.length);
      banners.forEach(b => {
        this.Banners2.push(b);
      });
    }
  }

  GetIndexBanners() {
    this.csdata.IndexBanner()
      .subscribe(
        result => {
          let banners: IndexBannerSetting[]
          if (result.ResultCode == EC_Success) {
            banners = result.Banners;
            this.nativeStorage.setItem("banners2", banners);
            this.ChangeBanners(banners);
          }
        }
      );
  }

  OpenWeb(url: string) {
    if (url != null && url.trim().length > 0) {
      const browser = this.iab.create(
        url,
        "_blank",
        {
          location: "no"
        });
    }
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
}
