import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { SearchNotePage } from "./search-note.page";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("SearchNotePage", () => {
  let component: SearchNotePage;
  let fixture: ComponentFixture<SearchNotePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchNotePage],
      imports: [IonicModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchNotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
