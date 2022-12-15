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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { AddComponentDialogComponent } from './dialogs/add-component-dialog/add-component-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaveTemplateDialogComponent } from './dialogs/save-template-dialog/save-template-dialog.component';
import { ArrayContainsPipe } from './pipes/array-contains.pipe';

export const API_BASE = new InjectionToken<string>('API_BASE');

const materialModules = [
  DragDropModule,
  MatSidenavModule,
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule
];

@NgModule({
  declarations: [
    AppComponent,
    AddComponentDialogComponent,
    SaveTemplateDialogComponent,
    ArrayContainsPipe
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
