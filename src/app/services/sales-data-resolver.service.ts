
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonApiService } from './common-api.service';
import { AuthenticationService } from './authentication.service';



@Injectable({
    providedIn: 'root',
})
export class SalesDataResolverService implements Resolve<any> {

    constructor(private commonapiservice: CommonApiService, private authenticationService: AuthenticationService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        // const id = route.paramMap.get('purchaseid');
        // const salesid = route.paramMap.get('enqid');

        const id = route.paramMap.get('id');
        const mode = route.paramMap.get('mode');
        if (mode === 'edit') {
            return this.commonapiservice.salesMasterData(id);
        } else {
            return null;
        }



        // if (id != null && mode === 'enquiry') {
        //     return this.commonapiservice.salesMasterData(id);
        // } else if (id != null && mode === 'edit') {
        //     return this.commonapiservice.salesMasterData(id);
        // }

    }



}
