import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { LoaderComponent } from './components/loader/loader.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ModalComponent } from './components/modal/modal.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

// Pipes
import { BengaliNumberPipe } from './pipes/bengali-number.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { SafePipe } from './pipes/safe.pipe';

const components = [
  LoaderComponent,
  HeaderComponent,
  SidebarComponent,
  ModalComponent,
  StatusBadgeComponent,
  ConfirmDialogComponent
];

const pipes = [
  BengaliNumberPipe,
  TimeAgoPipe,
  SafePipe
];

@NgModule({
  declarations: [
    ...components,
    ...pipes
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...components,
    ...pipes
  ]
})
export class SharedModule { }

