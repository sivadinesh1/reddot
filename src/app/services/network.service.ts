
import { Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

import { Injectable } from '@angular/core';
import { Observable, fromEvent, merge, of } from 'rxjs';

import { mapTo } from 'rxjs/operators';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private online$: Observable<boolean> = null;

  constructor(private network: Network, private platform: Platform,
    private openNativeSettings: OpenNativeSettings
  ) {
    this.online$ = Observable.create(observer => {
      observer.next(true);
    }).pipe(mapTo(true));

    if (this.platform.is('cordova')) {
      // on Device
      this.online$ = merge(
        this.network.onConnect().pipe(mapTo(true)),
        this.network.onDisconnect().pipe(mapTo(false)));
    } else {
      // on Browser
      this.online$ = merge(of(navigator.onLine),
        fromEvent(window, 'online').pipe(mapTo(true)),
        fromEvent(window, 'offline').pipe(mapTo(false))
      );
    }
  }

  public getNetworkType(): string {
    return this.network.type;
  }

  public getNetworkStatus(): Observable<boolean> {
    return this.online$;
  }



  public openNetworkSettings() {
    this.openNativeSettings.open('settings').then((result) => {
      console.log('inside settings native');
    }).catch((err) => {
      console.log('inside settings native' + JSON.stringify(err));
    });
  }


}


// https://forum.ionicframework.com/t/ionic-4-network-check-example-problem/157909