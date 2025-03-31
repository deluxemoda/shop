import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZapatosComponent } from './zapatos.component';

describe('ZapatosComponent', () => {
  let component: ZapatosComponent;
  let fixture: ComponentFixture<ZapatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZapatosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZapatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
