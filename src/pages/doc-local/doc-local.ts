import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { DocumentViewerOptions, DocumentViewer } from '@ionic-native/document-viewer';
import { FileOpener } from '@ionic-native/file-opener';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the DocLocalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-doc-local',
  templateUrl: 'doc-local.html',
})
export class DocLocalPage {
  DownloadingList = [];
  LocalFileList: LocalDocItem[] = new Array<LocalDocItem>();
  get LocalRootDir() {
    if (this.plt.is("ios")) {
      return this.file.dataDirectory ;
    }
    else {
      return this.file.dataDirectory ;
    }
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public file: File,
    public opener: FileOpener,
    public plt: Platform,
    public nativeStorage: NativeStorage
  ) {
  }

  ionViewDidLoad() {
    this.nativeStorage.getItem("DocDownSueccList")
      .then(
        i => {
          if (i != null) {
            this.DownloadingList = i;
            this.file.listDir(this.LocalRootDir, "行业资料")
            .then(
              enties => {
                enties.forEach(i => {
                  // if (i.isFile) {
                  //   let li = new LocalDocItem();
                  //   li.Name = i.name;
                  //   li.LocalPath = this.LocalRootDir + "行业资料/" + i.name;
                  //   this.LocalFileList.push(li);
                  // }
                  if (i.isFile) {
                    this.DownloadingList.forEach(fileName => {
                      //alert("i"+fileName);
                      if(i.name==fileName){ 
                       // alert("o"+i.name);
                        let li = new LocalDocItem();
                        li.Name = i.name;
                        li.LocalPath = this.LocalRootDir + "行业资料/" + i.name;
                        this.LocalFileList.push(li);
                      }
                    });                      
                  }
                
                });

              }
            );            
          }

        }
      )
      .catch(i => {
        alert('异常');
      });


  }

  ItemClick(item: LocalDocItem) {
    this.opener.open(item.LocalPath, 'application/pdf')
      .catch(reason => {
        let msg = "";
        Object.keys(reason).forEach(
          k => {
            msg = msg + k + ":" + reason[k] + "\n";
          }
        )
        alert(msg);
      });
  }

}

class LocalDocItem {
  Name: string;
  LocalPath: string;
}
