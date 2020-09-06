import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { NotesService } from "../notes.service";
import { Router, ActivatedRoute } from "@angular/router";
import { isNullOrUndefined } from "util";
import { ToastController } from "@ionic/angular";
import { CheckListItem } from "../models/note.model";
import { SubSink } from "subsink";

@Component({
  selector: "app-add-note",
  templateUrl: "./add-note.page.html",
  styleUrls: ["./add-note.page.scss"],
})
export class AddNotePage implements OnInit, OnDestroy, AfterViewInit {
  public title: string = "";
  public description: string = "";
  public id: string;
  public checkList: CheckListItem[] = [];
  public isCheckList: boolean = false;
  isDeleteNote: boolean = false;
  checkedItemsList: boolean = true;
  @ViewChild("titleInput", { static: false }) titleInput;
  @ViewChild("descInput", { static: false }) descInput;
  @ViewChild("descInputForCheckList", { static: false }) descInputForCheckList;
  private sink = new SubSink();

  constructor(
    private notesService: NotesService,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    const noteId = JSON.parse(
      this.activatedRoute.snapshot.paramMap.get("noteId")
    );
    this.sink.add(
      this.notesService.notes$.subscribe((notes) => {
        const note = notes.filter((element) => {
          return element.id === noteId;
        });
        if (note.length !== 0) {
          this.title = note[0].title;
          this.description = note[0].description;
          this.id = note[0].id;
          this.isCheckList = note[0].isCheckList;
          this.checkList = note[0].checkList;
        }
      })
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (!this.isCheckList) {
        this.titleInput.setFocus();
      }
    }, 400);
  }

  /**
   * Sets focus on description field when enter key is pressed from title input
   * @param event keyup event
   */
  onEnterKeyPress(event): void {
    if (event.keyCode === 13) {
      this.descInput.setFocus();
    }
  }

  /**
   * Adds item to checklist
   */
  addItem(): void {
    if (this.description !== "") {
      const item: CheckListItem = {
        checked: false,
        description: this.description,
      };
      this.checkList.push(item);
      this.description = "";
      //focus on field
      this.descInputForCheckList.setFocus();
    }
  }

  /**
   * Deletes item from checklist
   * @param i index of item
   */
  deleteListItem(i: number): void {
    this.checkList.splice(i, 1);
  }

  /**
   * Sets note type
   */
  setNoteType(): void {
    this.isCheckList = !this.isCheckList;
  }

  /**
   * Reorders the check list
   * @param event re-order event
   */
  doReorder(event) {
    const itemMove = this.checkList.splice(event.detail.from, 1)[0];
    this.checkList.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
  }

  /**
   * Adds note to behavior subject
   */
  addNote(): void {
    if (
      this.title !== "" ||
      this.description !== "" ||
      this.checkList.length !== 0
    ) {
      this.notesService.addNote({
        id: this.id,
        title: this.title,
        description: this.isCheckList ? "" : this.description,
        checkList: this.checkList,
        isCheckList: this.isCheckList,
      });
    } else {
      this.presentToast();
    }
  }

  /**
   * Edit check list item
   * @param index index of checklist item
   */
  editItem(index: number): void {
    this.description = this.checkList[index].description;
    this.checkList.splice(index, 1);
    this.descInputForCheckList.setFocus();
  }

  /**
   * Shows/Hides checked items list
   */
  showCheckedItems(): boolean {
    const index = this.checkList.findIndex((element) => {
      return element.checked === true;
    });
    return index !== -1;
  }

  /**
   * Navigates back to home page
   */
  navigateBack(): void {
    this.ngZone.run(() => {
      this.router.navigate(["home"]);
    });
  }

  /**
   * Shows toast message in case of empty note
   */
  async presentToast(): Promise<any> {
    const toast = await this.toastController.create({
      message: "Empty notes will be discarded",
      duration: 1500,
      color: "dark",
      mode: "md",
    });
    toast.present();
  }

  /**
   * Deletes note
   */
  deleteNote(): void {
    if (isNullOrUndefined(this.id)) {
      this.title = "";
      this.description = "";
      this.checkList = [];
    } else {
      this.notesService.deleteNotes([
        {
          id: this.id,
          title: this.title,
          description: this.description,
          isCheckList: this.isCheckList,
          checkList: this.checkList,
        },
      ]);
    }
    this.isDeleteNote = !this.isDeleteNote;
    this.navigateBack();
  }

  ngOnDestroy() {
    if (!this.isDeleteNote) {
      this.addNote();
    }
    this.sink.unsubscribe();
  }
}
