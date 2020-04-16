import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../components/loading/loading.service';
import { MessagesService } from '../components/messages/messages.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [
    LoadingService,
    MessagesService
  ]
})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
