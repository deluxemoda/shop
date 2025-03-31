import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabeceratresComponent } from './cabeceratres.component';

describe('CabeceratresComponent', () => {
  let component: CabeceratresComponent;
  let fixture: ComponentFixture<CabeceratresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabeceratresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabeceratresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
