import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditCustomerPage } from './edit-customer.page';

describe('EditCustomerPage', () => {
  let component: EditCustomerPage;
  let fixture: ComponentFixture<EditCustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCustomerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
