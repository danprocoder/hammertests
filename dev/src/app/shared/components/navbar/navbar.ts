import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { IUser, UserService } from '@qa/user';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, NzDropDownModule, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {
  user$: Observable<IUser | null>;

  constructor(private userService: UserService) {
    this.user$ = this.userService.user$.asObservable();
  }
}
