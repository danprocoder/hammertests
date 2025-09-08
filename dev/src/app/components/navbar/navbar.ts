import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, NzDropDownModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  user: any;

  ngOnInit() {
    this.user = jwtDecode(localStorage.getItem('token') ?? '');
  }
}
