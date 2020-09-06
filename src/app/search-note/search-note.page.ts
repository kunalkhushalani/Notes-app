import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import { NotesService } from "../notes.service";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { Note } from "../models/note.model";
import { SubSink } from "subsink";

@Component({
  selector: "app-search-note",
  templateUrl: "./search-note.page.html",
  styleUrls: ["./search-note.page.scss"],
})
export class SearchNotePage implements OnInit, OnDestroy {
  public cards: Note[] = [];
  public cardsCopy: Note[] = [];
  public searchKeyword: string = "";
  private sink = new SubSink();

  constructor(
    private notesService: NotesService,
    private router: Router,
    private ngZone: NgZone,
    private modal: ModalController
  ) {}

  ngOnInit() {
    this.sink.add(
      this.notesService.notes$.subscribe((notes) => {
        this.cardsCopy = notes;
      })
    );
  }

  /**
   * Filters the cards based on search keyword
   * @param event search input event
   */
  onInput(event): void {
    this.cards = [];
    if (event.target.value !== "") {
      this.cardsCopy.forEach((element) => {
        if (
          element.title
            .toUpperCase()
            .includes(event.target.value.toUpperCase()) ||
          element.description
            .toUpperCase()
            .includes(event.target.value.toUpperCase())
        ) {
          this.cards.push(element);
        }
      });
    }
  }

  /**
   * Adds/updates note by navigating to add-note page
   * @param note note to be added/updated
   */
  add(note: Note): void {
    this.closeModal();
    this.ngZone.run(() => {
      this.router.navigate(["add-note", JSON.stringify(note)]);
    });
  }

  /**
   * Closes modal
   */
  closeModal(): void {
    this.modal.dismiss();
  }

  ngOnDestroy() {
    this.sink.unsubscribe();
  }
}
