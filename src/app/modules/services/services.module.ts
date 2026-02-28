import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from './services.component';

const routes: Routes = [
  { path: '', component: ServicesComponent },
];

@NgModule({
  declarations: [ServicesComponent],
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class ServicesModule { }
