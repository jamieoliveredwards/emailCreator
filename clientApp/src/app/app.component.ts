import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, map, Observable, of, startWith, switchMap, take, tap } from 'rxjs';
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
  @ViewChild('templateList', { read: ElementRef }) public templateList?: ElementRef<HTMLDivElement>;

  public componentsRefresh = new BehaviorSubject<null>(null);
  public components$ = this.componentsRefresh.pipe(
    switchMap(() => this.componentsService.getAll())
  );

  public templatesRefresh = new BehaviorSubject<null>(null);
  public templates$ = this.templatesRefresh.pipe(
    switchMap(() => this.templatesService.getAll()),
    tap(templates => {
      const matchedTemplate = templates.find(t => t.name === this.template.name);
      if (matchedTemplate) this.template = matchedTemplate;
    })
  );

  public template: Template = {
    name: 'New template',
    components: []
  };

  public showHeaderShadow$ = new BehaviorSubject<boolean>(false);
  public saveInProgress$: Observable<boolean> = of(false);
  public deleteInProgress$: Observable<boolean> = of(false);

  constructor(
    @Inject(API_BASE) public apiBase: string,
    private componentsService: ComponentsService,
    private templatesService: TemplatesService,
    private dialog: MatDialog
  ) { }

  clearTemplate(clearName = true) {
    this.template = {
      name: clearName ? 'New template' : this.template.name,
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
    ).subscribe(() => {
      this.componentsRefresh.next(null);
      this.templatesRefresh.next(null);
    });
  }

  save(template: Template) {
    this.saveInProgress$ = SaveTemplateDialogComponent.show(this.dialog, template).afterClosed().pipe(
      tap(template => {
        console.log()
        if (template) {
          this.templatesRefresh.next(null);
          this.template = template;
        }
      }),
      map(() => false),
      startWith(false)
    );
  }

  deleteTemplate() {
    this.deleteInProgress$ = this.templatesService.delete(this.template.name).pipe(
      tap(response => {
        if (response) {
          this.templatesRefresh.next(null);
          this.clearTemplate();
        }
      }),
      map(() => false),
      startWith(false)
    )
  }

  deleteComponentFromTemplate(index: number) {
    this.template.components.splice(index, 1);
  }

  // print() {
  //   console.log(this.templateList);
  //   const iFrame = document.createElement('iframe');
  //   iFrame.style.position = "absolute";
  //   iFrame.style.top = "-10000px";
  //   document.body.appendChild(iFrame);
  //   iFrame.contentDocument?.write(this.templateList?.nativeElement.innerHTML || '');


  //   setTimeout(function () {
  //     iFrame.focus();
  //     iFrame.contentWindow?.print();
  //     iFrame.parentNode?.removeChild(iFrame);// remove frame
  //   }, 3000); // wait for images to load inside iframe
  //   window.focus();
  // }
}
