import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';


import { CountryPhone } from '../../util/validators/country-phone.model';
import { PhoneValidator } from '../../util/validators/phone.validator';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  invalidLogin = false;

  countries: Array<CountryPhone>;

  responsemsg: any;
  apiresponse: any;



  validation_messages = {
    'phone': [
      { type: 'required', message: 'Phone Number is required.' },
      { type: 'pattern', message: 'Enter a valid Phone Number.' },
      { type: 'invalidCountryPhone', message: 'Mobile Number seems wrong.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };



  constructor(
    public router: Router,
    private cdr: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
  ) {

    // displays sample phone # in UI, placeholder="{{ this.countries[0].sample_phone }}"
    this.countries = [
      new CountryPhone('IN', 'India'),
      new CountryPhone('US', 'United States'),

    ];

    const country = new FormControl(this.countries[0], Validators.required);

    this.loginForm = new FormGroup({

      'phone': new FormControl('', Validators.compose([
        Validators.required, PhoneValidator.invalidCountryPhone(country)
      ])),



      'password': new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ]))
    });





  }

  ngOnInit(): void {

  }





  doFacebookLogin(): void {
    console.log('facebook login');
    this.router.navigate(['auth/fb-login']);
  }

  doGoogleLogin(): void {
    console.log('google login');
    this.router.navigate(['auth/gp-login']);
  }



  doLogin(): void {

    let username = this.loginForm.controls.phone.value;
    let password = this.loginForm.controls.password.value;

    console.log('object ' + username);
    console.log('object ' + password);

    this.authenticationService.login(username, password).subscribe(
      async data => {

        if (data.message === 'SUCCESS') {

          console.log('object......' + JSON.stringify(data));

          let role = data.role;
          // this.authenticationService.setRole(role);
          // this.authenticationService.setUserid(data.userid);



          if (role === 'ADMIN') {

            this.router.navigate([`/home`]);

            this.invalidLogin = false;
            this.cdr.markForCheck();
          }


        } else if (data.message === 'FAILURE') {
          this.invalidLogin = true;

          if (data.additionalinfo === 'INVALID_CREDENTIALS') {
            this.responsemsg = "Login Failed. Invalid Credentials";
          }

        }


      }

    );


  }



  ngOnDestroy() {

  }

}


