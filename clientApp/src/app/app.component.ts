import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { API_BASE } from './app.module';
import { AddComponentDialogComponent } from './dialogs/add-component-dialog/add-component-dialog.component';
import { SaveTemplateDialogComponent } from './dialogs/save-template-dialog/save-template-dialog.component';
import { ComponentsService } from './services/components.service';
import { Template, TemplatesService } from './services/templates.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public isAdmin = window.localStorage.getItem('isAdmin');
  public zoom = 1;

  @ViewChild('componentsList', { read: ElementRef }) public componentList?: ElementRef<HTMLDivElement>;

  public componentsRefresh = new BehaviorSubject<null>(null);
  public components$ = this.componentsRefresh.pipe(
    switchMap(() => this.componentsService.getAll())
  );

  public templatesRefresh = new BehaviorSubject<null>(null);
  public templates$ = this.templatesRefresh.pipe(
    switchMap(() => this.templatesService.getAll())
  );

  public template: Template = {
    name: 'New template',
    components: []
  };

  public showHeaderShadow$ = new BehaviorSubject<boolean>(false);
  public saveInProgress$: Observable<boolean> = of(false);

  constructor(
    @Inject(API_BASE) public apiBase: string,
    private componentsService: ComponentsService,
    private templatesService: TemplatesService,
    private dialog: MatDialog
  ) { }

  clearTemplate() {
    this.template = {
      name: 'New template',
      components: []
    };
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  componentsScrollHandler(event: Event) {
    const element = event.target as HTMLDivElement;
    this.showHeaderShadow$.next(!!element.scrollTop);
  }

  openAddComponentDialog() {
    const subscription = AddComponentDialogComponent.show(this.dialog).afterClosed().subscribe(reload => {
      if (reload) {
        this.componentsRefresh.next(null);
      }
      subscription.unsubscribe();
    });
  }

  deleteComponent(component: string) {
    this.componentsService.delete(component).pipe(
      take(1)
    ).subscribe(() => this.componentsRefresh.next(null));
  }

  save(template: Template) {
    this.saveInProgress$ = SaveTemplateDialogComponent.show(this.dialog, template).afterClosed().pipe(
      tap(reload => {
        if (reload) {
          this.templatesRefresh.next(null);
        }
      }),
      map(() => false)
    );
  }
}
