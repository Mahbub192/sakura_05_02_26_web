import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AssistantRoutingModule } from './assistant-routing.module';
import { AssistantLayoutComponent } from './layout/assistant-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    AssistantLayoutComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AssistantRoutingModule,
    SharedModule
  ]
})
export class AssistantModule { }


