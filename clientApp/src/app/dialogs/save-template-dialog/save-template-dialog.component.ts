import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, startWith, tap } from 'rxjs';
import { Template, TemplatesService } from 'src/app/services/templates.service';

@Component({
  selector: 'app-save-template-dialog',
  templateUrl: './save-template-dialog.component.html',
  styleUrls: ['./save-template-dialog.component.scss']
})
export class SaveTemplateDialogComponent {

  public formGroup = new FormGroup({
    name: new FormControl<string>(this.template.name, [Validators.required])
  });

  public saveRequest$?: Observable<any> = of({ loading: false, result: null });

  constructor(
    private templatesService: TemplatesService,
    private dialogRef: MatDialogRef<SaveTemplateDialogComponent, Template>,
    @Inject(MAT_DIALOG_DATA) public template: Template
  ) { }

  public submit() {
    const newTemplateValue = {
      ...this.template,
      name: this.formGroup.value.name as string
    }
    this.saveRequest$ = this.templatesService.create(newTemplateValue).pipe(
      startWith({ loading: true, result: null }),
      tap(response => {
        if (response) {
          setTimeout(() => {
            this.dialogRef.close(newTemplateValue);
          }, 0);
        };
      })
    );
  }

  public static show(dialog: MatDialog, data: Template) {
    return dialog.open(SaveTemplateDialogComponent, { data });
  }

}