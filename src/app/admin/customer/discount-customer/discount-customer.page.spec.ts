import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiscountCustomerPage } from './discount-customer.page';

describe('DiscountCustomerPage', () => {
  let component: DiscountCustomerPage;
  let fixture: ComponentFixture<DiscountCustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountCustomerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiscountCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
