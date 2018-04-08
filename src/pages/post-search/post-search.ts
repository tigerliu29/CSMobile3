import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { RegionInfo, PostTagInfo } from '../../providers/cs-data/cs-data';
import { checkAvailability } from '@ionic-native/core';

/**
 * Generated class for the PostSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-post-search',
  templateUrl: 'post-search.html',
})
export class PostSearchPage {

  Regions: RegionInfo[] = new Array<RegionInfo>();
  ZYTags: PostTagInfo[] = new Array<PostTagInfo>();
  TypeTags: PostTagInfo[] = new Array<PostTagInfo>();
  Region: RegionInfo;
  ZYTag: PostTagInfo;
  TypeTag: PostTagInfo;
  SearchPattern: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {

    let allregion = new RegionInfo();
    allregion.Name = "所有地区";
    let allZY = new PostTagInfo();
    allZY.Name = "所有专业";
    let alltype = new PostTagInfo();
    alltype.Name = "所有类型";

    this.Regions.push(allregion);
    navParams.get("Regions").forEach(i => this.Regions.push(i));

    this.ZYTags.push(allZY);
    navParams.get("ZYTags").forEach(i => this.ZYTags.push(i));

    this.TypeTags.push(alltype);
    navParams.get("TypeTags").forEach(i => this.TypeTags.push(i));

    this.Region = navParams.get("Region");
    if (this.Region == null) {
      this.Region = allregion;
    }

    this.ZYTag = navParams.get("ZYTag");
    if (this.ZYTag == null) {
      this.ZYTag = allZY;
    }

    this.TypeTag = navParams.get("TypeTag");
    if (this.TypeTag == null) {
      this.TypeTag = alltype;
    }

    this.SearchPattern = navParams.get("SearchPattern");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostSearchPage');
  }

  DoSearch() {

    this.viewCtrl.dismiss(
      {
        Region: this.Region.Code == null ? null : this.Region,
        TypeTag: this.TypeTag.Id == null ? null : this.TypeTag,
        ZYTag: this.ZYTag.Id == null ? null : this.ZYTag,
        SearchPattern: this.SearchPattern
      }
    );
  }

}
