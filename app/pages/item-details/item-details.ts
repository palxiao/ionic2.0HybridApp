import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {log} from './myFilter';


@Component({
  templateUrl: 'build/pages/item-details/item-details.html'
})
export class ItemDetailsPage {
  selectedItem;

  constructor(public navCtrl: NavController, navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    //this.selectedItem = navParams.data.item;
    
  }


}
