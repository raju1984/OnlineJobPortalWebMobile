import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import {AutoCompleteService} from 'ionic2-auto-complete';

/*
  Generated class for the AutocompleteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AutocompleteProvider {
  items:string[];
  constructor(public http: HttpClient) {
    console.log('Hello AutocompleteProvider Provider');
    this.initializeItems(); 
  }
  initializeItems() {    
    this.items = [
      'Course 1',
      'Course 2',     
      'Course 3',     
      'Course 4',     
      'Course 5',     
      'Course 6',     
    ];
  }
  getResults(keyword:string) {
    console.log(keyword);    
    this.initializeItems();    
    // if the value is an empty string don't filter the items
    if (keyword && keyword.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(keyword.toLowerCase()) > -1);
      })
    }
  }

}
