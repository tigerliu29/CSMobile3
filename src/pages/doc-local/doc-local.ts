import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { DocumentViewerOptions, DocumentViewer } from '@ionic-native/document-viewer';

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
    public docViewer: DocumentViewer
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
              li.LocalPath = i.fullPath;
              this.LocalFileList.push(li);
            }
          });
        }
      );
  }

  ItemClick(item: LocalDocItem) {
    console.log("ItemClick");
    const options: DocumentViewerOptions = {
      title: item.Name
    }    
    if (this.docViewer.canViewDocument(item.LocalPath, 'application/pdf', options)) {
      console.log("Can view");
      this.docViewer.viewDocument(item.LocalPath, 'application/pdf', options);
    }
    else{
      console.log("Can not view");
    }
  }

}

class LocalDocItem {
  Name: string;
  LocalPath: string;
}
