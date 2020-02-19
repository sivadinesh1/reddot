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

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

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

            let tempCurrentUser = await this.getLocalStoreItems('currentUser');

            this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(tempCurrentUser));
            this.currentUser = this.currentUserSubject.asObservable();

        });
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
                    this.storagemode.set('localstoredata', userData.obj);
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
            .pipe(map(userData => {
                debugger;

                if (userData.message === 'SUCCESS') {
                    this.storagemode.clear();

                    this.storagemode.set('currentUser', JSON.stringify(userData.obj));
                    this.currentUserSubject.next(userData.obj);
                }


                return userData;
            }));
    }


}







