import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('drawer', { read: ElementRef }) public componentList?: ElementRef<HTMLDivElement>;

  public components = ['header.jpeg', 'content.jpeg', 'content_and_img.png', 'content_and_content.png', 'content_cta.png', 'footer_1.png', 'product_and_product.png'];

  public template: any[] = [];

  public showHeaderShadow$ = new BehaviorSubject<boolean>(false);

  ngAfterViewInit() {
    const drawerInner = this.componentList?.nativeElement.firstChild as HTMLDivElement;
    drawerInner.onscroll = () => {
      this.showHeaderShadow$.next(!!drawerInner.scrollTop);
    }
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
}
