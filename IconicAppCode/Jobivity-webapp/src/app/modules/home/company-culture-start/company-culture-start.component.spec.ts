import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCultureStartComponent } from './company-culture-start.component';

describe('CompanyCultureStartComponent', () => {
  let component: CompanyCultureStartComponent;
  let fixture: ComponentFixture<CompanyCultureStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyCultureStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCultureStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
