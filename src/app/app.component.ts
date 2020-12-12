import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { NetworkService } from './services/network.service';
import { LoadingService } from './services/loading.service';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  @ViewChild(RouterOutlet, { static: true }) outlet: RouterOutlet;

  isConnected; any;


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, private _loadingservice: LoadingService,
    private networkService: NetworkService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
        this.isConnected = connected;

        if (!connected) {
          this._loadingservice.presentToastWithOptions('Oops !!! Internet Connection Lost.', 'bottom', false, '');
          this.networkService.openNetworkSettings();
        }

      });


    });
  }

  ngOnInit(): void {

  }


}
