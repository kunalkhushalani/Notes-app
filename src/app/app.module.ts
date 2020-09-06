import { NgModule } from "@angular/core";
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
} from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { DatabaseManagerService } from "./database-manager.service";
import { SearchNotePage } from "./search-note/search-note.page";
import { SearchNotePageModule } from "./search-note/search-note.module";
import { IonicGestureConfig } from "./IonicGestureConfig";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatMenuModule } from "@angular/material/menu";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [SearchNotePage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SearchNotePageModule,
    BrowserAnimationsModule,
    MatMenuModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatabaseManagerService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
