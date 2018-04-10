import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { DirectoryRecord, CsDataProvider } from '../../providers/cs-data/cs-data';
import { EC_Success } from '../../app/app.module';
import { DocPage } from '../doc/doc';
import { DocLocalPage } from '../doc-local/doc-local';

/**
 * Generated class for the DocRootPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-doc-root',
  templateUrl: 'doc-root.html',
})
export class DocRootPage {

  RootItems: DirectoryRecord[] = new Array<DirectoryRecord>();
  Downloaded = new DirectoryRecord();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public csdata: CsDataProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.Downloaded.Name = "已下载";
    this.Downloaded.IconUrl = "assets/imgs/Downloaded.png";
    this.RootItems.push(this.Downloaded);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocRootPage');
    let loader = this.loadingCtrl.create({
      content: "获取数据..."
    });
    loader.present();
    this.csdata.DogumentList("")
      .subscribe(
        result => {
          loader.dismiss();
          if (result.ResultCode == EC_Success) {
            result.Directories.forEach(i => this.RootItems.push(i));
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

  ItemClick(item: DirectoryRecord) {
    if (item.Path == null || item.Path.length == 0) {
      this.navCtrl.push(DocLocalPage);
    }
    else {
      this.navCtrl.push(DocPage, { Path: item.Path, Name: item.Name });
    }
  }

}
