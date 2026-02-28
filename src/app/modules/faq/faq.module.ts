import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './faq.component';

const routes: Routes = [
  { path: '', component: FaqComponent },
];

@NgModule({
  declarations: [FaqComponent],
  imports: [
    FormsModule,
    RouterModule.forChild(routes),
  ],
})
export class FaqModule { }
