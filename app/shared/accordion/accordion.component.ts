import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChild, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-accordion',
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss'
})
export class AccordionComponent implements AfterContentInit {

  @Input() title!: string;
  @ContentChild(TemplateRef) contentTemplate!: TemplateRef<any>;

  isOpen: boolean = false;

  ngAfterContentInit() {
    if (!this.contentTemplate) {
      console.warn('No content template found in the accordion.');
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}