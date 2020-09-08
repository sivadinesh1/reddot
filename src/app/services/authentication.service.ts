import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { map, filter } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { isPlatformBrowser, } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Platform, } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from '../models/User';


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private currentUserSubject = new BehaviorSubject<User>(null);
    public currentUser: Observable<User> = this.currentUserSubject.asObservable();


    private currentMenuSubject = new BehaviorSubject<any>(null);
    public currentMenu: Observable<any> = this.currentMenuSubject.asObservable();

    restApiUrl = environment.restApiUrl;

    storagemode: any;
    device: any;
    errormsg = 'Something went wrong. Contact administrator.';

    token: any;



    constructor(
        private httpClient: HttpClient, private plt: Platform,
        private storage: Storage,
        private nativeStorage: NativeStorage,

        @Inject(PLATFORM_ID) private platformId: any
    ) {
        this.plt.ready().then(async () => {

            if (isPlatformBrowser(this.platformId)) {
                this.storagemode = this.storage;
                this.device = 'browser';
            } else {
                this.storagemode = this.nativeStorage;
                this.device = 'mobile';
            }

            this.reloadLocalStorage();

        });
    }


    async reloadLocalStorage() {
        let tempCurrentUser = await this.getLocalStoreItems('currentUser');
        let tempMenuUser = await this.getLocalStoreItems('currentMenu');

        if (tempCurrentUser) {
            this.currentUserSubject.next(JSON.parse(tempCurrentUser));
        }
        if (tempMenuUser) {
            this.currentMenuSubject.next(tempMenuUser);
        }

    }

    setLocalStoreItems(key, value) {
        this.storagemode.set(key, value);
    }

    getLocalStoreItems(key): Promise<string> {
        return this.storagemode.get(key);
    }

    register(username, password) {

        return this.httpClient.post<any>(`${this.restApiUrl}/api/register`, { username, password }).pipe(
            map(
                userData => {
                    this.storagemode.clear();

                    let tokenStr = 'Bearer ' + userData.additionalinfo;

                    this.storagemode.set('username', username);
                    this.storagemode.set('token', tokenStr);
                    this.storagemode.set('currentUser', JSON.stringify(userData.obj));

                    this.currentUserSubject.next(userData.obj);


                    return userData;
                }
            )

        );
    }

    async logOut() {
        await this.storagemode.clear();
        this.currentUserSubject.next(null);
    }


    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }


    login(username: string, password: string) {

        return this.httpClient.post<any>(`${this.restApiUrl}/api/auth/login`, { username, password })
            .pipe(map(data => {


                if (data.result === 'success') {
                    this.storagemode.clear();

                    this.storagemode.set('currentUser', JSON.stringify(data.obj));

                    this.currentUserSubject.next(data.obj);
                }
                return data;
            }));
    }


    setCurrentMenu(clickedMenu) {
        this.storagemode.set('currentMenu', clickedMenu);
        this.currentMenuSubject.next(clickedMenu);
    }

}







