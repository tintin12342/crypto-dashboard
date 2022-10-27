import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedChartComponent } from './selected-chart.component';

describe('SelectedChartComponent', () => {
  let component: SelectedChartComponent;
  let fixture: ComponentFixture<SelectedChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
