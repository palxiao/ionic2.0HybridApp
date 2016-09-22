import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ItemDetailsPage} from '../item-details/item-details';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { InfiniteScroll, ToastController, AlertController} from 'ionic-angular';
import {HelloIonicPage} from '../hello-ionic/hello-ionic';



@Component({
  templateUrl: 'build/pages/list/list2.html'
})
export class ListPage2 {
  http;
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string, content: string}>;
  pageNum = 0; //记录页数 初始化0为最后一页

  constructor(public navCtrl: NavController, navParams: NavParams,http:Http ,private toastCtrl:ToastController,public alertCtrl:AlertController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];
    this.http = http ;
    this.items = [];
    this.doAlert("这里暂时还没有内容哦");
    // this.http.get("http://localhost:8080/blog/json").map(res=>res.json()).subscribe(data=>{
    //     console.log(data.list);
    //     if(data.lastPage != "ture") { //如果不是最后一页
    //         this.pageNum = data.pageNumber
    //     }
    //     for(let i = 0; i < data.list.length ; i++){
    //         this.items.push({
    //           title: data.list[i].title ,
    //           note: 'This is item #' + i,
    //           content: data.list[i].content ,
    //           icon: this.icons[Math.floor(Math.random() * this.icons.length)]
    //         });
    //     }
    // });
  }

  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }
  doInfinite(infiniteScroll: InfiniteScroll) {
    if(this.pageNum != 0){
      this.http.get("http://localhost:8080/blog/json/"+(this.pageNum+1)).map(res=>res.json()).subscribe(data=>{
          //console.log(this.pageNum);
          for(let i = 0; i < data.list.length ; i++){
            
              this.items.push({
                title: data.list[i].title ,
                note: 'This is item #' + i,
                content: data.list[i].content ,
                icon: this.icons[Math.floor(Math.random() * this.icons.length)]
              });
            }

          if(this.pageNum < data.totalPage) { //如果不是最后一页
              this.pageNum = data.pageNumber
          }else{
            infiniteScroll.enable(false);
            this.showToast("top","已经到最后一页了!");//bottom  top  middle
          }
      });
    }
    infiniteScroll.complete();
    // if (this.items.length >= 12) {
    //     infiniteScroll.enable(false);
    //     alert("已到达最底页!")
    //   }
  }
  //吐司测试
  showToast(position:string, content:string){
    const toast = this.toastCtrl.create({
      message: content ,
      position: position ,
      duration: 2800 ,
    });
    toast.present();
  }
  //alert测试
  doAlert(content:string){
    let alert = this.alertCtrl.create({
      title: content,
      buttons: [{
        text:'好吧',
        handler: ()=>{
          this.navCtrl.setRoot(HelloIonicPage);
        }
      }]
    });
    alert.present();
  }

}
