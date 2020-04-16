import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountsReceivablePage } from './accounts-receivable.page';

describe('AccountsReceivablePage', () => {
  let component: AccountsReceivablePage;
  let fixture: ComponentFixture<AccountsReceivablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsReceivablePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsReceivablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
