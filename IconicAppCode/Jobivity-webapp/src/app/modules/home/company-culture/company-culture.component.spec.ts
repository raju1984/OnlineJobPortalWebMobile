import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCultureComponent } from './company-culture.component';

describe('CompanyCultureComponent', () => {
  let component: CompanyCultureComponent;
  let fixture: ComponentFixture<CompanyCultureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyCultureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCultureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
