import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsLedgerComponent } from './credits-ledger.component';

describe('CreditsLedgerComponent', () => {
  let component: CreditsLedgerComponent;
  let fixture: ComponentFixture<CreditsLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditsLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditsLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
