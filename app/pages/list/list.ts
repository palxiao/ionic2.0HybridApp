import {Component} from '@angular/core';
import {NavController, NavParams, Refresher} from 'ionic-angular';
import {ItemDetailsPage} from '../item-details/item-details';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { InfiniteScroll, ToastController, LoadingController, AlertController} from 'ionic-angular';



@Component({
  templateUrl: 'build/pages/list/list.html'
})
export class ListPage {
  http;
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string, content: string}>;
  pageNum = 0; //记录页数 初始化0为最后一页
  totalRow = 0;

  constructor(public navCtrl: NavController, 
              navParams: NavParams,
              http:Http ,
              private toastCtrl:ToastController,
              public loadingCtrl: LoadingController,
              public alertCtrl:AlertController){
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];
    this.http = http ;
    this.items = [];

    this.http.get("http://palxp.com/spider_api/blog/json").map(res=>res.json()).subscribe(data=>{
        console.log(data);
        this.totalRow = data.totalRow;
        if(data.lastPage != "ture") { //如果不是最后一页
            this.pageNum = data.pageNumber
        }
        this.myLoading("加载中...");
        for(let i = 0; i < data.list.length ; i++){
            this.items.push({
              title: data.list[i].title ,
              note: '123',
              content: data.list[i].content ,
              icon: this.icons[Math.floor(Math.random() * this.icons.length)]
            });
        }
    },error => {
      this.doAlert("请检查网络是否畅通");
    });
  }

  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }
  doInfinite(infiniteScroll: InfiniteScroll) {

      this.http.get("http://palxp.com/spider_api/blog/json/"+(this.pageNum+1)).map(res=>res.json()).subscribe(data=>{
        setTimeout(() => {
          console.log(this.pageNum);
          for(let i = 0; i < data.list.length ; i++){
              this.items.push({
                title: data.list[i].title ,
                note: 'This is item #' + i,
                content: data.list[i].content ,
                icon: this.icons[Math.floor(Math.random() * this.icons.length)]
              });
            }
        }, 1000);

          if(this.pageNum < data.totalPage) { //如果不是最后一页
              this.pageNum = data.pageNumber
          }
      });
    
    infiniteScroll.complete();

    if (this.items.length >= this.totalRow) {
        infiniteScroll.enable(false);
        this.showToast("top","已经到最后一页了!");//bottom  top  middle
      }
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
  myLoading(content:string) { //ios dots bubbles circles crescent
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: content,
      duration: 400
    });

    loading.present();
  }
  doAlert(content:string){
    let alert = this.alertCtrl.create({
      title: content,
      buttons: [{
        text:'好吧',
        handler: ()=>{
          this.navCtrl.push(ListPage);
        }
      }]
    });
    alert.present();
  }
  //下拉刷新
  doRefresh(refresher: Refresher) {
    console.log('DOREFRESH', refresher);
    this.navCtrl.push(ListPage);
    refresher.complete();
  }
  doPulling(refresher: Refresher) {
    console.log('DOPULLING', refresher.progress);
  }
}
