import { Component } from '@angular/core';
import { AttendenceComponent } from './attendence/attendence.component';
import { AccordionComponent } from "./shared/accordion/accordion.component";

@Component({
    selector: 'app-root',
    imports: [
    AttendenceComponent,
    AccordionComponent
],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Project-Attendence';
}
