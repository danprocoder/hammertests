import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TestFeature } from '@qa/test-plan/services/test-feature';

@Component({
  selector: 'app-test-plans',
  imports: [
    NzTableModule,
    NzButtonModule,
    NzDropDownModule,
    NzIconModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './test-plans.html',
  styleUrl: './test-plans.scss'
})
export class TestPlans {
  plans: ITestPlan[] = [];

  constructor(private featureService: TestFeature) {}

  ngOnInit() {
    this.featureService.getPlans().subscribe((plans) => {
      console.log(plans);
      this.plans = plans.data.testPlans;
    });
  }
}
