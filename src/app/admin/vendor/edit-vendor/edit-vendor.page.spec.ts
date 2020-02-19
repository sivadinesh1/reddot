import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditVendorPage } from './edit-vendor.page';

describe('EditVendorPage', () => {
  let component: EditVendorPage;
  let fixture: ComponentFixture<EditVendorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVendorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditVendorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
