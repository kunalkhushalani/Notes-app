import { Component, OnInit } from "@angular/core";

import { Platform } from "@ionic/angular";
import { Plugins } from "@capacitor/core";
import { DatabaseManagerService } from "./database-manager.service";
import { NotesService } from "./notes.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private databaseManagerService: DatabaseManagerService,
    private notesService: NotesService
  ) {
    this.initializeApp();
  }

  ngOnInit() {}

  initializeApp() {
    this.platform.ready().then(() => {
      Plugins.SplashScreen.hide({ fadeOutDuration: 400 });
      Plugins.StatusBar.setBackgroundColor({ color: "#121212" });
      this.initializeDB();
    });
  }

  async initializeDB(): Promise<any> {
    await this.databaseManagerService.initializeDB();
    this.updateBS();
  }

  /**
   * Updates local Behaviour Subject
   */
  async updateBS(): Promise<any> {
    const keyCheck = await this.databaseManagerService.checkKey("notes");
    if (keyCheck.result) {
      const notes = await this.databaseManagerService.fetch("notes");
      this.notesService.cards = JSON.parse(notes.value);
      this.notesService.notes$.next(JSON.parse(notes.value));
    } else {
      this.databaseManagerService.insert("notes", []);
    }
  }
}
