import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Navbar } from '../navbar/navbar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ChangeWorkspace } from '../change-workspace/change-workspace';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClipboardList, faBullseye, faCalendar, faGauge, faSquarePollHorizontal, faBug, faListCheck, faBarsProgress } from '@fortawesome/free-solid-svg-icons';
import { IUser, UserService } from '@qa/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-container',
  imports: [
    NzLayoutModule,
    NzCardModule,
    NzMenuModule,
    NzIconModule,
    RouterModule,
    FontAwesomeModule,
    Navbar,
    ChangeWorkspace
  ],
  templateUrl: './container.html',
  styleUrl: './container.scss'
})
export class Container {
  // fa icons definitions
  public faGauge = faGauge;
  public faCalendar = faCalendar;
  public faListCheck = faListCheck;
  public faBarsProgress = faBarsProgress;
  public faClipboardList = faClipboardList;
  public faBullseye = faBullseye;
  public faSquarePollHorizontal = faSquarePollHorizontal;
  public faBug = faBug;

  user$: Observable<IUser | null>;

  constructor(private userService: UserService) {
    this.user$ = this.userService.user$.asObservable();
  }

  ngOnInit(): void {
    this.userService.getCurrentUser();
  }
}
