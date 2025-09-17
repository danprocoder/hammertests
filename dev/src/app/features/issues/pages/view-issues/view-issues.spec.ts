import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIssues } from './view-issues';

describe('ViewIssues', () => {
  let component: ViewIssues;
  let fixture: ComponentFixture<ViewIssues>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewIssues]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewIssues);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
