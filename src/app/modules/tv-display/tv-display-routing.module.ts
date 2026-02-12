import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TvDisplayComponent } from './pages/tv-display/tv-display.component';

const routes: Routes = [
  { path: '', component: TvDisplayComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TvDisplayRoutingModule { }


