import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlassFloorRatioComponent } from './glass-floor-ratio.component';

describe('GlassFloorRatioComponent', () => {
  let component: GlassFloorRatioComponent;
  let fixture: ComponentFixture<GlassFloorRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlassFloorRatioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlassFloorRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
