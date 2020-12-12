import { NgModule, LOCALE_ID } from '@angular/core';
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
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Network } from '@ionic-native/network/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';


import { SharedModule } from 'src/app/shared.module';
import { KeyBoardService } from './services/keyboard.service';

import { registerLocaleData, CurrencyPipe } from '@angular/common';

import localeIn from '@angular/common/locales/en-IN';
import { HomePageModule } from './home/home.module';
registerLocaleData(localeIn);
// import { BackButtonDisableModule } from 'angular-disable-browser-back-button';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,


    HttpClientModule,
    SharedModule,
    HomePageModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    // BackButtonDisableModule.forRoot({
    //   preserveScrollPosition: true
    // }),
    AppRoutingModule, BrowserAnimationsModule],
  exports: [BrowserModule],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    Network,
    OpenNativeSettings,
    KeyBoardService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    CurrencyPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }




