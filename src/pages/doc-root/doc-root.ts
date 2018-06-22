import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { DirectoryRecord, CsDataProvider } from '../../providers/cs-data/cs-data';
import { EC_Success } from '../../app/app.module';
import { DocPage } from '../doc/doc';
import { DocLocalPage } from '../doc-local/doc-local';
import { DocSearchPage } from '../doc-search/doc-search';

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

  RootItems = [];
  //Downloaded = new DirectoryRecord();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public csdata: CsDataProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    // this.Downloaded.Name = "已下载";
    // this.Downloaded.IconUrl = "assets/imgs/Downloaded.png";
    // this.RootItems.push(this.Downloaded);
  }
  //ionViewDidEnter()
//  ionViewDidLoad() 只加载一次
ionViewDidLoad() {
    let  loader = this.loadingCtrl.create({
      content: "获取数据..."
    });
    this.RootItems=[];
    loader.present();
    this.csdata.DogumentList("")
      .subscribe(
        result => {
          loader.dismiss();
          console.log(result);
          if (result.ResultCode == EC_Success) {

            // this.Downloaded.Name = "已下载";
            // this.Downloaded.IconUrl = "assets/imgs/Downloaded.png";
            let rowobj = { Name: "已下载", IconUrl: "assets/imgs/Downloaded.png", Path: "",FirstDirName:""};
            let RowDir = new Array<DirectoryRecord>();
            RowDir.push(rowobj);
            let rowcount = 1;
            result.Directories.forEach(
              i => {

                if (rowcount == 3) {
                  RowDir.push(i);
                  this.RootItems.push(RowDir);
                  RowDir = new Array<DirectoryRecord>();
                  console.log(rowcount);
                  rowcount = 0;
                } else {
                  RowDir.push(i);
                  console.log(rowcount);
                  rowcount++;
                }
              }
            );
            if (rowcount != 0) {    
              for (let i = 0; i < 4 - rowcount; i++) {
                let objnull = { Name: "", IconUrl: "", Path: "" ,FirstDirName:""};
                RowDir.push(objnull);
              }
              this.RootItems.push(RowDir);
            }
            console.log(this.RootItems);
            //result.Directories.forEach(i => this.RootItems.push(i));
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
  onInput(event) {
    //let searchedText = ev.target.value;
     console.log('onInput');
     
  }

  inputChanged() {
    //let searchedText = ev.target.value;

    this.navCtrl.push(DocSearchPage);
  }
}
