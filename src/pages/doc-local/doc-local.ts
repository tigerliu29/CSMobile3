import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { DocumentViewerOptions, DocumentViewer } from '@ionic-native/document-viewer';
import { FileOpener } from '@ionic-native/file-opener';

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

  LocalFileList: LocalDocItem[] = new Array<LocalDocItem>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public file: File,
    public opener: FileOpener
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocLocalPage');
    this.file.listDir(this.file.externalRootDirectory, "行业资料")
      .then(
        enties => {
          enties.forEach(i => {
            if (i.isFile) {
              let li = new LocalDocItem();
              li.Name = i.name;              
              li.LocalPath = this.file.externalRootDirectory + "行业资料/" + i.name;
              alert(li.LocalPath);
              this.LocalFileList.push(li);
            }
          });
        }
      );
  }

  ItemClick(item: LocalDocItem) {
    this.opener.open(item.LocalPath, 'application/pdf')
      .catch(reason => {
        let msg = "";
        Object.keys(reason).forEach(
          k=>{
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
