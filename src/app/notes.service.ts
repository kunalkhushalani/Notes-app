import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { DatabaseManagerService } from "./database-manager.service";
import { isNullOrUndefined } from "util";
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding,
} from "@capacitor/core";
const { Filesystem } = Plugins;
import { LoadingController } from "@ionic/angular";
import { v4 as uuidv4 } from "uuid";
import { Note } from "./models/note.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NotesService {
  cards: Note[] = [];
  notes$: BehaviorSubject<Note[]> = new BehaviorSubject([]);

  constructor(
    private databaseManagerService: DatabaseManagerService,
    private loadingController: LoadingController,
    private httpClient: HttpClient
  ) {}

  /**
   * Adds note
   * @param note note to add
   */
  async addNote(note: any) {
    if (isNullOrUndefined(note.id)) {
      // will add new note
      this.cards.splice(0, 0, {
        id: uuidv4(),
        title: note.title,
        description: note.description,
        checkList: note.checkList,
        isCheckList: note.isCheckList,
      });
    } else {
      // will update note
      let index: number = this.cards.findIndex((element) => {
        return element.id === note.id;
      });
      this.cards[index].title = note.title;
      this.cards[index].description = note.description;
      this.cards[index].checkList = note.checkList;
      this.cards[index].isCheckList = note.isCheckList;
    }
    this.notes$.next(this.cards);
    await this.insertNote("notes", this.cards);
  }

  /**
   * Get notes from database
   * @param key key
   */
  async getNotes(key: string): Promise<any> {
    return await this.databaseManagerService.fetch(key);
  }

  /**
   * Inserts note in database
   * @param key key
   * @param note note
   */
  async insertNote(key: string, note: Note[]): Promise<any> {
    return await this.databaseManagerService.insert(key, note);
  }

  async deleteNotes(notes) {
    notes.forEach((note) => {
      const index = this.cards.findIndex((element) => {
        return element.id === note.id;
      });
      this.cards.splice(index, 1);
    });
    this.notes$.next(this.cards);
    await this.insertNote("notes", this.cards);
  }

  /**
   * Backup notes
   */
  async backup() {
    const loading = await this.loadingController.create({
      message: "Creating notes backup...",
    });
    await loading.present();
    try {
      const result = await Filesystem.writeFile({
        path: "notes.json",
        data: JSON.stringify(this.cards),
        directory: FilesystemDirectory.External,
        encoding: FilesystemEncoding.UTF8,
      });
      loading.dismiss();
    } catch (e) {
      alert("Backup failed!");
    }
  }

  /**
   * Imports notes from json file
   */
  async import() {
    const loading = await this.loadingController.create({
      message: "Importing notes",
    });
    await loading.present();
    let contents = await Filesystem.readFile({
      path: "notes.json",
      directory: FilesystemDirectory.External,
      encoding: FilesystemEncoding.UTF8,
    });
    this.notes$.next(JSON.parse(contents.data));
    this.insertNote("notes", JSON.parse(contents.data));
    loading.dismiss();
  }

  /**
   * Imports notes from cloud
   */
  cloudImport(): Observable<Note[]> {
    return this.httpClient
      .get<Note[]>("https://steppingstone-14e77.firebaseio.com/notes.json")
      .pipe(catchError(this.errorHandler));
  }

  /**
   * Http error handler
   * @param error http error
   */
  errorHandler(error: HttpErrorResponse): Observable<never> {
    return throwError(error || "Server error");
  }
}
