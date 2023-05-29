import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCreditLedgerComponent } from './company-credit-ledger.component';

describe('CompanyCreditLedgerComponent', () => {
  let component: CompanyCreditLedgerComponent;
  let fixture: ComponentFixture<CompanyCreditLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyCreditLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCreditLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
