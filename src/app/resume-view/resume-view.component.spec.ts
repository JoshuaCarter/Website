import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeViewComponent } from './resume-view.component';

describe('ResumeViewComponent', () => {
  let component: ResumeViewComponent;
  let fixture: ComponentFixture<ResumeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
