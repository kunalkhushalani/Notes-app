import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import { NotesService } from "../notes.service";
import { Platform } from "@ionic/angular";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { SearchNotePage } from "../search-note/search-note.page";
import { Plugins } from "@capacitor/core";
import { Note } from "../models/note.model";
const { Toast } = Plugins;
import { SubSink } from "subsink";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit, OnDestroy {
  public cards = [];
  public searchMode: boolean = true;
  public compactView: boolean = true;
  public viewBtnText: string = "Expanded view";
  private isModalActive: boolean = false;
  public deleteMode: boolean = false;
  private deleteList = [];
  private interval;
  private sink = new SubSink();

  constructor(
    private notesService: NotesService,
    private platform: Platform,
    private router: Router,
    private ngZone: NgZone,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.sink.add(
      this.platform.backButton.subscribe((res) => {
        if (this.router.url === "/home" && !this.isModalActive) {
          navigator["app"].exitApp();
        }
      })
    );
    this.sink.add(
      this.notesService.notes$.subscribe((notes) => {
        this.cards = notes;
      })
    );
  }

  /**
   * Toggles cards view
   */
  toggleView(): void {
    this.compactView = !this.compactView;
    if (this.compactView) {
      this.viewBtnText = "Expanded view";
    } else {
      this.viewBtnText = "Compact view";
    }
  }

  /**
   * Adds/updates note by navigating to add-note page
   * @param note note to be added/updated
   */
  add(note: Note): void {
    this.ngZone.run(() => {
      this.router.navigate(["add-note", JSON.stringify(note.id)]);
    });
  }

  /**
   * Opens search modal
   */
  async searchNotes(): Promise<any> {
    this.isModalActive = !this.isModalActive;
    const modal = await this.modalController.create({
      component: SearchNotePage,
    });
    modal
      .onWillDismiss()
      .then((data) => {
        this.isModalActive = !this.isModalActive;
      })
      .catch((err) => {});
    return await modal.present();
  }

  /**
   * Triggers when card is pressed
   */
  pressed(note: Note): void {
    this.startInterval(note);
  }

  /**
   * Triggers when press is released
   */
  released(): void {
    this.stopInterval();
  }

  /**
   * Starts long press interval
   */
  startInterval(note: Note): void {
    this.interval = setInterval(() => {
      this.deleteMode = !this.deleteMode;
      this.addToDeleteList(note);
      this.stopInterval();
    }, 200);
  }

  /**
   * Stops long press interval
   */
  stopInterval(): void {
    clearInterval(this.interval);
  }

  /**
   * Adds/removes notes from delete list
   * @param note note
   */
  addToDeleteList(note: Note): void {
    const index = this.deleteList.findIndex((element) => {
      return element.id === note.id;
    });
    if (index === -1) {
      this.deleteList.push(note);
    } else {
      this.deleteList.splice(index, 1);
    }
  }

  /**
   * Selects all cards to delete
   */
  selectAllCardsToDelete(): void {
    this.deleteList = [].concat(this.cards);
  }

  /**
   * Checks if note is added for delete or not
   * @param note note
   */
  isAddedForDelete(note: Note): boolean {
    const index = this.deleteList.findIndex((element) => {
      return element.id === note.id;
    });
    return index === -1;
  }

  /**
   * Deletes selected notes and shows toast message
   */
  async deleteNotes(): Promise<any> {
    this.notesService.deleteNotes(this.deleteList);
    await Toast.show({
      text: "Notes deleted",
    });
    this.resetDeleteMode();
  }

  /**
   * Resets delete mode and delete list
   */
  resetDeleteMode(): void {
    this.deleteMode = !this.deleteMode;
    this.deleteList = [];
  }

  /**
   * Imports notes from json file
   */
  importNotes(): void {
    this.notesService.import();
  }

  /**
   * Backups notes
   */
  backup(): void {
    this.notesService.backup();
  }

  ngOnDestroy() {
    this.sink.unsubscribe();
  }
}
