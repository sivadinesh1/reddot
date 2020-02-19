import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddVendorPage } from './add-vendor.page';

describe('AddVendorPage', () => {
  let component: AddVendorPage;
  let fixture: ComponentFixture<AddVendorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVendorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddVendorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
