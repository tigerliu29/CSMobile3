import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController, ModalController, PopoverController } from 'ionic-angular';
import { CsDataProvider, PostRecordInfo, PostReplyInfo, RegionInfo, PostTagInfo } from '../../providers/cs-data/cs-data';
import { last } from 'rxjs/operators';
import { NewPostPage } from '../new-post/new-post';
import { PostSearchPage } from '../post-search/post-search';

/**
 * Generated class for the CyclePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-cycle',
  templateUrl: 'cycle.html'
})
export class CyclePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public csdata: CsDataProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController
  ) {
  }

  PostRecords: PostRecordInfo[] = new Array<PostRecordInfo>();

  Regions: RegionInfo[] = new Array<RegionInfo>();
  ZYTags: PostTagInfo[] = new Array<PostTagInfo>();
  TypeTags: PostTagInfo[] = new Array<PostTagInfo>();
  SearchPattern: string = "";
  Region: RegionInfo;
  ZYTag: PostTagInfo;
  TypeTag: PostTagInfo;


  ionViewDidLoad() {
    console.log('ionViewDidLoad CyclePage');
    this.GetPost(false);
  }

  GetPost(getNew: boolean, infiniteScroll?: any) {
    let loader = this.loadingCtrl.create({
      content: "刷新中..."
    });
    loader.present();

    let lastpid = null;
    let lastptime = null;
    if (this.PostRecords.length > 0) {
      let br = getNew ? this.PostRecords[0] : this.PostRecords[this.PostRecords.length - 1];
      lastpid = br.Id;
      lastptime = br.PublishTime;
    }

    let tagids = new Array<string>();
    if (this.ZYTag != null)
      tagids.push(this.ZYTag.Id);
    if (this.TypeTag != null)
      tagids.push(this.TypeTag.Id);
    let regionCode = null;
    if (this.Region != null)
      regionCode = this.Region.Code;
    this.csdata.GetPostRecords(getNew, tagids, regionCode, this.SearchPattern, null, null, lastpid, lastptime)
      .subscribe(
        result => {

          if (infiniteScroll != null)
            infiniteScroll.complete();
          if (result.ResultCode == 0) {
            this.MergePosts(result.PostRecords, this.PostRecords);
            result.Regions.forEach(
              r => {
                for (let i = 0; i < this.Regions.length; i++) {
                  if (this.Regions[i].Code == r.Code)
                    return;
                }
                this.Regions.push(r);
              }
            );
            result.PostTags.forEach(
              t => {
                if (t.Category == "消息分类") {
                  for (let i = 0; i < this.TypeTags.length; i++) {
                    if (this.TypeTags[i].Id == t.Id)
                      return;
                  }
                  this.TypeTags.push(t);
                }
                else if (t.Category == "专业分类") {
                  for (let i = 0; i < this.ZYTags.length; i++) {
                    if (this.ZYTags[i].Id == t.Id)
                      return;
                  }
                  this.ZYTags.push(t);
                }
              }
            );
          }
          else {
            let toast = this.toastCtrl.create({
              message: result.ErrorMessage,
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
          loader.dismiss();
        }
      );
  }

  private MergePosts(records: PostRecordInfo[], target: PostRecordInfo[]) {
    records.forEach(
      r => {
        let index = 0;
        do {
          if (index == target.length) {
            target.push(r);
            break;
          }
          else if (r.Id == target[index].Id) {
            break;
          }
          else if (target[index].PublishTime >= r.PublishTime) {
            if (index >= target.length - 1) {
              target.push(r);
              break;
            }
            else if (target[index + 1].PublishTime < r.PublishTime) {
              target.splice(index + 1, 0, r);
              break;
            }
          }
          index++;
        } while (index <= target.length);
      }
    );
  }

  private MergeReplies(replis: PostReplyInfo[], target: PostReplyInfo[]) {

  }

  doInfinite(infiniteScroll) {
    this.GetPost(false, infiniteScroll);
  }

  Reply(record: PostRecordInfo) {
    let prompt = this.alertCtrl.create({
      title: '回复内容',
      inputs: [
        {
          name: 'Content',
          placeholder: '输入回复内容'
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: data => {
          }
        },
        {
          text: '确定',
          handler: data => {
            let loader = this.loadingCtrl.create({
              content: "正在发布新帖..."
            });
            loader.present();
            this.csdata.NewReply(record.Id, data["Content"], this.csdata.UserId)
              .subscribe(r => {
                if (r.ResultCode != 0) {                  
                  let toast = this.toastCtrl.create({
                    message: r.ErrorMessage,
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                  loader.dismiss();
                }
                else {
                  let lastid = null;
                  let lasttime = null;
                  if (record.Replies.length > 0) {
                    let r = record.Replies[0];
                    lastid = r.Id;
                    lasttime = r.ReplyTime;
                  }
                  this.csdata.GetReply(true, record.Id, lastid, lasttime)
                    .subscribe(r => {                      
                      if (r.ResultCode != 0) {
                        let toast = this.toastCtrl.create({
                          message: r.ErrorMessage,
                          duration: 3000,
                          position: 'top'
                        });
                        toast.present();
                      }
                      else {
                        for (let i = r.Replies.length - 1; i >= 0; i--) {
                          record.Replies.splice(0, 0, r.Replies[i]);
                        }
                      }
                      loader.dismiss();
                    });
                }
              });
          }
        }
      ]
    });
    prompt.present();
  }

  ShowSearch() {
    let search = this.modalCtrl.create(
      PostSearchPage,
      {
        Regions: this.Regions,
        TypeTags: this.TypeTags,
        ZYTags: this.ZYTags,
        TypeTag: this.TypeTag,
        ZYTag: this.ZYTag,
        SearchPattern: this.SearchPattern,
        Region: this.Region
      }
    );
    search.onDidDismiss(
      data => {
        if (data != null) {
          this.Region = data.Region;
          this.ZYTag = data.ZYTag;
          this.TypeTag = data.TypeTag;
          this.SearchPattern = data.SearchPattern;
          this.PostRecords.splice(0, this.PostRecords.length);
          this.GetPost(false);
        }
      }
    );
    search.present();
  }

  NewPost() {
    let modal = this.modalCtrl.create(
      NewPostPage,
      {
        Regions: this.Regions,
        TypeTags: this.TypeTags,
        ZYTags: this.ZYTags
      }
    );
    modal.onDidDismiss(
      data => {
        if (data) {
          this.GetPost(true);
        }
      }
    );
    modal.present();
  }

  DeletePost(record: PostRecordInfo) {
    let loader = this.loadingCtrl.create({
      content: "删除帖子..."
    });
    loader.present();

    this.csdata.DeletePost(record.Id)
      .subscribe(
        result => {          
          if (result.ResultCode == 0) {
            for (let i = 0; i < this.PostRecords.length; i++) {
              if (this.PostRecords[i].Id == record.Id) {
                this.PostRecords.splice(i, 1);
              }
            }
          }
          else {
            let toast = this.toastCtrl.create({
              message: result.ErrorMessage,
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
          loader.dismiss();
        }
      );
  }
}
