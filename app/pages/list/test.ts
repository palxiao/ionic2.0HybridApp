import { Component, Injectable } from '@angular/core';
import { InfiniteScroll, NavController, ToastController, LoadingController, AlertController, Refresher } from 'ionic-angular';
import {ItemDetailsPage} from '../item-details/item-details';
import {HelloIonicPage} from '../hello-ionic/hello-ionic';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class MockProvider {
  http;

  constructor(http: Http,public alertCtrl:AlertController,public navCtrl: NavController,public loadingCtrl: LoadingController) {
    this.http = http;
  }

  getData(): any[] {

    let mydata = [];
  this.http.get("http://palxp.com/spider_api/blog/json").map(res=>res.json()).subscribe(data=>{
    for (var i = 0; i < data.list.length; i++) {
      mydata.push({
        title: data.list[i].title ,
        content: data.list[i].content ,
      });
    }
  },error => {
      this.doAlert("请检查网络是否畅通");
    });
    return mydata;
  }
  // 弹框
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

  getAsyncData(): Promise<any[]> {
    // 异步接收数据
    return new Promise(resolve => {

      setTimeout(() => {
        //resolve(this.getData());
        resolve();
      },1000);
    });
  }
}

@Component({
  templateUrl: 'build/pages/list/test.html',
  providers: [MockProvider]
})
export class ApiDemoApp {
  items: any;
  pageNum = 1;

  constructor(private mockProvider: MockProvider,public navCtrl: NavController,private toastCtrl:ToastController) {
    let loading = this.mockProvider.loadingCtrl.create({
      spinner: 'ios',
      content: "拼命加载中",
      // duration: 500
    });
    loading.present();
    // 这里模拟了延时加载，实际不延时销毁则在用户无网络时loading会一直存在
    setTimeout(() => {
        loading.dismiss();
      },800);
    setTimeout(() => { //测试差值至少400毫秒否则页面会有未知错误
        this.items = mockProvider.getData();
      },1200);
  }
  //绑定点击事件
  itemTapped(event, item) {

    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }
  //上啦加载事件
  doInfinite(infiniteScroll: InfiniteScroll) {
    this.mockProvider.getAsyncData().then(() => {
      console.log("第"+this.pageNum+"页")
      this.mockProvider.http.get("http://palxp.com/spider_api/blog/json/"+(this.pageNum+1)).map(res=>res.json()).subscribe(data=>{
        if(data.lastPage != "ture") { //如果不是最后一页
            this.pageNum = data.pageNumber
        }
        for (var i = 0; i < data.list.length; i++) {
          this.items.push({
            title: data.list[i].title,
            content: data.list[i].content
          });
        }
        if (this.pageNum > data.totalPage) {
        infiniteScroll.enable(false);
        this.showToast("top","已经到最后一页了!","2500");//bottom  top  middle
      }
      });

      infiniteScroll.complete();
      
    });
  }
  //吐司测试
  showToast(position:string, content:string, howLong){
    const toast = this.toastCtrl.create({
      message: content ,
      position: position ,
      duration: howLong 
    });
    toast.present();
  }
  //下拉刷新
  doRefresh(refresher: Refresher) {
    console.log('开始刷新', refresher);
    this.showToast("middle","机智如我假装加载了新数据","1500");//bottom  top  middle

    refresher.complete();
  }
  doPulling(refresher: Refresher) {
    console.log('正往下拉', refresher.progress);
  }
}