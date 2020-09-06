import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchNotePage } from './search-note.page';

const routes: Routes = [
  {
    path: '',
    component: SearchNotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchNotePageRoutingModule {}
