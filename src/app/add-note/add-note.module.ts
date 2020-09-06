import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AddNotePageRoutingModule } from "./add-note-routing.module";

import { AddNotePage } from "./add-note.page";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddNotePageRoutingModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
  ],
  declarations: [AddNotePage],
})
export class AddNotePageModule {}
