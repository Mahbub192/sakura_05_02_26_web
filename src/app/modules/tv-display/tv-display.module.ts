import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TvDisplayRoutingModule } from './tv-display-routing.module';
import { TvDisplayComponent } from './pages/tv-display/tv-display.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    TvDisplayComponent
  ],
  imports: [
    CommonModule,
    TvDisplayRoutingModule,
    SharedModule
  ]
})
export class TvDisplayModule { }


