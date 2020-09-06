import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { HomePage } from "./home.page";

import { HomePageRoutingModule } from "./home-routing.module";
import { MatMenuModule } from "@angular/material/menu";
import { RandomcolorModule } from "angular-randomcolor";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MatMenuModule,
    RandomcolorModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
