import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NzCalendarMode, NzCalendarModule } from "ng-zorro-antd/calendar";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss'],
  imports: [FormsModule, NzCalendarModule]
})
export class Calendar {
  date = new Date();
  mode: NzCalendarMode = 'month';

  panelChange(change: { date: Date; mode: NzCalendarMode }): void {
    console.log('Panel changed:', change);
  }
}