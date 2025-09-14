import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TestFeature } from '@qa/test-plan/services/test-feature';
import { NzPopconfirmDirective } from "ng-zorro-antd/popconfirm";

@Component({
  selector: 'app-test-plans',
  imports: [
    NzTableModule,
    NzButtonModule,
    NzDropDownModule,
    NzIconModule,
    RouterModule,
    CommonModule,
    NzPopconfirmDirective
  ],
  providers: [NzMessageService],
  templateUrl: './test-plans.html',
  styleUrl: './test-plans.scss'
})
export class TestPlans {
  plans: ITestPlan[] = [];
  
  constructor(private featureService: TestFeature, private message: NzMessageService) {}

  ngOnInit() {
    this.getTestPlans();
  }

  getTestPlans() {
    this.featureService.getPlans().subscribe((plans) => {
      this.plans = plans.data.testPlans;
    });
  }

  deletePlan(plan: ITestPlan) {
    const mid = this.message.loading('Deleting plan...');

    this.featureService.deletePlan(plan._id).subscribe((res) => {
      this.message.remove(mid.messageId);
      this.message.success('Plan deleted');

      this.getTestPlans();
    }, (err) => {
      this.message.remove(mid.messageId);
      this.message.error('Error deleting plan');
    });
  }
}
