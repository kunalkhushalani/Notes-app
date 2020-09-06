import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { AddNotePage } from "./add-note.page";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("AddNotePage", () => {
  let component: AddNotePage;
  let fixture: ComponentFixture<AddNotePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNotePage],
      imports: [IonicModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
