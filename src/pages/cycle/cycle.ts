import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { CsDataProvider, PostRecordInfo, PostReplyInfo } from '../../providers/cs-data/cs-data';
import { last } from 'rxjs/operators';

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
    public alertCtrl: AlertController
  ) {
  }

  PostRecords: PostRecordInfo[] = new Array<PostRecordInfo>();

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

    this.csdata.GetPostRecords(getNew, null, null, null, null, null, lastpid, lastptime)
      .subscribe(
        result => {
          loader.dismiss();
          if (infiniteScroll != null)
            infiniteScroll.complete();
          if (result.ResultCode == 0) {
            this.MergePosts(result.PostRecords, this.PostRecords);
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
            else {
              index++;
            }
          }
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
                  loader.dismiss();
                  let toast = this.toastCtrl.create({
                    message: r.ErrorMessage,
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
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
                      loader.dismiss();
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
                    });
                }
              });
          }
        }
      ]
    });
    prompt.present();
  }
}
