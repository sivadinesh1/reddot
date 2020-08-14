import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InventoryReportsPage } from './inventory-reports.page';

describe('InventoryReportsPage', () => {
  let component: InventoryReportsPage;
  let fixture: ComponentFixture<InventoryReportsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryReportsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
