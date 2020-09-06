import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SearchNotePageRoutingModule } from "./search-note-routing.module";

import { SearchNotePage } from "./search-note.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchNotePageRoutingModule,
  ],
  declarations: [SearchNotePage],
  exports: [SearchNotePage],
})
export class SearchNotePageModule {}
