import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiedosComponent } from './piedos.component';

describe('PiedosComponent', () => {
  let component: PiedosComponent;
  let fixture: ComponentFixture<PiedosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiedosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiedosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
