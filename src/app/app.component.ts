import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoadingService } from './services/loading.service';
import { NetworkService } from './services/network.service';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  isConnected; any;

  appPages = [];
  accountPages = [];
  adminmenu = [
    {
      title: 'Member Tutorial',
      url: '/walkthrough',
      icon: './assets/sample-icons/side-menu/tutorial.svg'
    }
  ];

  constructor(
    private platform: Platform, private _cdr: ChangeDetectorRef,
    private splashScreen: SplashScreen, private _authservice: AuthenticationService,
    private statusBar: StatusBar, private _loadingservice: LoadingService,
    private networkService: NetworkService, private _router: Router,
  ) {
    this.initializeApp();
  }




  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
        this.isConnected = connected;
        console.log('network value' + connected);
        if (!connected) {
          this._loadingservice.presentToastWithOptions('Oops !!! Internet Connection Lost.', 'bottom', false, '');
          this._loadingservice.confirm
          this.networkService.openNetworkSettings();
        }

      });


    });
  }

}
