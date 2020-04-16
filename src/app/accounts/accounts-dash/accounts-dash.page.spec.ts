import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountsDashPage } from './accounts-dash.page';

describe('AccountsDashPage', () => {
  let component: AccountsDashPage;
  let fixture: ComponentFixture<AccountsDashPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsDashPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsDashPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
