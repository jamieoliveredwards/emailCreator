import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { AddComponentDialogComponent } from './dialogs/add-component-dialog/add-component-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaveTemplateDialogComponent } from './dialogs/save-template-dialog/save-template-dialog.component';

export const API_BASE = new InjectionToken<string>('API_BASE');

const materialModules = [
  DragDropModule,
  MatSidenavModule,
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatMenuModule
];

@NgModule({
  declarations: [
    AppComponent,
    AddComponentDialogComponent,
    SaveTemplateDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ...materialModules
  ],
  providers: [
    {
      provide: API_BASE,
      useValue: 'http://localhost:8081'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
