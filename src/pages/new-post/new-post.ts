import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { RegionInfo, PostTagInfo, CsDataProvider } from '../../providers/cs-data/cs-data';
import { EC_Success } from '../../app/app.module';

/**
 * Generated class for the NewPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-new-post',
  templateUrl: 'new-post.html',
})
export class NewPostPage {

  Regions: RegionInfo[];
  ZYTags: PostTagInfo[];
  TypeTags: PostTagInfo[];
  Region: RegionInfo;
  ZYTag: PostTagInfo;
  TypeTag: PostTagInfo;
  Content: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public csdata: CsDataProvider,
    public viewCtrl: ViewController
  ) {
    this.Regions = navParams.get("Regions");
    this.ZYTags = navParams.get("ZYTags");
    this.TypeTags = navParams.get("TypeTags");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewPostPage');
  }

  NewPost() {
    if (this.TypeTag == null) {
      let toast = this.toastCtrl.create({
        message: "请选择类型。",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }

    if (this.ZYTags == null) {
      let toast = this.toastCtrl.create({
        message: "请选择专业。",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }

    if (this.Regions == null) {
      let toast = this.toastCtrl.create({
        message: "请选择地区。",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }

    if (this.Content.trim().length == 0) {
      let toast = this.toastCtrl.create({
        message: "请输入帖子内容",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }

    let loader = this.loadingCtrl.create({
      content: "发帖..."
    });
    loader.present();
    this.csdata.NewPost(this.ZYTag.Id, this.TypeTag.Id, this.Region.Code, this.Content)
      .subscribe(
        result => {
          loader.dismiss();
          if (result.ResultCode == EC_Success) {
            this.viewCtrl.dismiss(true);
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
