import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Navbar } from '../navbar/navbar';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-container',
  imports: [NzLayoutModule, NzCardModule, NzMenuModule, NzIconModule, RouterModule, Navbar],
  templateUrl: './container.html',
  styleUrl: './container.scss'
})
export class Container {

}
