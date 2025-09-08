import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzListModule } from 'ng-zorro-antd/list';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TestFeature } from '@qa/test-plan/services/test-feature';

@Component({
  selector: 'app-view-test-plan',
  imports: [
    RouterModule,
    CommonModule,
    NzCollapseModule,
    NzListModule,
    NzIconModule,
    NzButtonModule
  ],
  templateUrl: './view-test-plan.html',
  styleUrl: './view-test-plan.scss'
})
export class ViewTestPlan {

  planId: string = '';
  plan?: ITestPlan;
  features: ITestFeature[] = [];

  environment: string = 'local';
  modulesToTest: string[] = [];

  constructor(
    private featureService: TestFeature,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(param => {
      this.planId = param['id'];
    });
  }

  ngOnInit() {
    this.featureService.getPlan(this.planId).subscribe(({ data: { testPlan } }) => {
      this.plan = testPlan;
      
      this.features = testPlan.features.sort((f1: any, f2: any) => f1.order - f2.order);
      this.features.forEach((f) => {
        f.testCases = f.testCases?.sort((a, b) => a.order - b.order);
      });
    });
  }
}
