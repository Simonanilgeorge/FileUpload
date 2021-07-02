import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyClientReportComponent } from './yearly-client-report.component';

describe('YearlyClientReportComponent', () => {
  let component: YearlyClientReportComponent;
  let fixture: ComponentFixture<YearlyClientReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearlyClientReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyClientReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
