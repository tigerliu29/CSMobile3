import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DocPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-doc',
  templateUrl: 'doc.html',
})
export class DocPage {

  ListRecords = new Array<DocListItem>();
  ListLocalRecords = new Array<DocListItem>();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocPage');
  }

  
}

class DocListItem{
  IconUrl: string;
  DisplayText: string;
}

class DocListDocumentItem extends DocListItem{
  LocalPath: string;
}

class DocListDirectoryItem extends DocListItem{

}

class DocListParentItem extends DocListItem{

}
