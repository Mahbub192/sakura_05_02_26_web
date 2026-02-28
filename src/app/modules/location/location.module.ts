import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationComponent } from './location.component';

const routes: Routes = [
  { path: '', component: LocationComponent },
];

@NgModule({
  declarations: [LocationComponent],
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class LocationModule { }
