import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, switchMap, take } from 'rxjs';
import { API_BASE } from './app.module';
import { AddComponentDialogComponent } from './dialogs/add-component-dialog/add-component-dialog.component';
import { ComponentsService } from './services/components.service';

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

  public template: any[] = [];

  public showHeaderShadow$ = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(API_BASE) public apiBase: string,
    private componentsService: ComponentsService,
    private dialog: MatDialog
  ) { }

  clearTemplate() {
    this.template = [];
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
}
