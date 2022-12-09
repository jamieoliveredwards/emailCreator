import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSidenavModule } from '@angular/material/sidenav';

const materialModules = [
  DragDropModule,
  MatSidenavModule
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ...materialModules
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
