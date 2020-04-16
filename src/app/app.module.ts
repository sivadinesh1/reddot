import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Network } from '@ionic-native/network/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';


import { SharedModule } from 'src/app/shared.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,

    HttpClientModule,
    SharedModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(), AppRoutingModule, BrowserAnimationsModule],
  exports: [BrowserModule],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    Network,
    OpenNativeSettings,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }




