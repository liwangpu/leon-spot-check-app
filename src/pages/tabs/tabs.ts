import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { MinePage } from '../mine/mine';
import { MessagePage } from '../message/message';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MessagePage;
  tab2Root = HomePage;
  tab3Root = MinePage;

  constructor() {
  }
}
