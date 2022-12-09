import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of, startWith, tap } from 'rxjs';
import { ComponentsService } from 'src/app/services/components.service';

@Component({
  selector: 'app-add-component-dialog',
  templateUrl: './add-component-dialog.component.html',
  styleUrls: ['./add-component-dialog.component.scss']
})
export class AddComponentDialogComponent {

  public fileControl = new FormControl<File | null>(null, [Validators.required]);
  public uploadRequest$: Observable<any> = of({ loading: false, result: null });

  public file?: File;

  constructor(
    private componentsService: ComponentsService,
    private dialogRef: MatDialogRef<AddComponentDialogComponent, boolean>
  ) { }

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.file = input.files?.item(0) as File;
  }

  public submit() {
    if (this.file) {
      this.uploadRequest$ = this.componentsService.create(this.file).pipe(
        startWith({ loading: true, result: null }),
        tap(response => {
          if (response.result === 'success') return this.dialogRef.close(true);
        })
      );
    }
  }

  public static show(dialog: MatDialog) {
    return dialog.open(AddComponentDialogComponent);
  }

}
