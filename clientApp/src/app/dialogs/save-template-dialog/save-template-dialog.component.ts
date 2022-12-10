import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, startWith, tap } from 'rxjs';
import { Template, TemplatesService } from 'src/app/services/templates.service';

@Component({
  selector: 'app-save-template-dialog',
  templateUrl: './save-template-dialog.component.html',
  styleUrls: ['./save-template-dialog.component.scss']
})
export class SaveTemplateDialogComponent {

  public saveRequest$?: Observable<any> = of({ loading: false, result: null });
  public template!: Template;

  constructor(
    private templatesService: TemplatesService,
    private dialogRef: MatDialogRef<SaveTemplateDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: Template
  ) {
    this.template = { ...data };
  }

  public submit() {
    this.saveRequest$ = this.templatesService.create(this.template).pipe(
      startWith({ loading: true, result: null }),
      tap(response => {
        if (response) return this.dialogRef.close(true);
      })
    );
  }

  public static show(dialog: MatDialog, data: Template) {
    return dialog.open(SaveTemplateDialogComponent, { data });
  }

}