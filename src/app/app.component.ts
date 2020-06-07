import { Component, ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { NetworkService } from './services/network.service';
import { AuthenticationService } from './services/authentication.service';
import { Router, NavigationStart } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { filter } from 'rxjs/operators';


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
  isBackUrl: boolean;

  constructor(
    private platform: Platform, private _cdr: ChangeDetectorRef,
    private splashScreen: SplashScreen, private _authservice: AuthenticationService,
    private statusBar: StatusBar, private _loadingservice: LoadingService,
    private networkService: NetworkService, private _router: Router,
  ) {
    this._router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        if (event.restoredState) {
          this.isBackUrl = true;
        }
      });
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
          // this._loadingservice.presentToastWithOptions('Oops !!! Internet Connection Lost.', 'bottom', false, '');
          // this._loadingservice.confirm
          this.networkService.openNetworkSettings();
        }

      });


    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander($event) {
    $event.returnValue = 'Your changes will not be saved';

    return true;

  }

  @HostListener('window:popstate', ['$event'])
  onPopState($event) {
    console.log('Back button pressed');
    //Here you can handle your modal
    // issue: Modal cancel button does not stop navigation back.
    // let feedback = this._loadingservice.confirm("Your Data will be lost.");
    // console.log('feedback ' + feedback);

    $event.returnValue = true;
  }

}
