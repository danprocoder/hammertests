import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { RunTestPlan } from './pages/run-test-plan/run-test-plan';
import { Results } from '@qa/test-run/pages/results/results';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { TestStatus } from '@qa/components/test-status/test-status';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { TestCaseDescription } from '@qa/components/test-case-description/test-case-description';
import { RunTestHistory } from '@qa/test-run/pages/run-test-history/run-test-history';
import { DurationCounter } from "@qa/components/duration-counter/duration-counter";
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateEdgeCaseIssueModal } from '../../components/create-edge-case-issue-modal/create-edge-case-issue-modal';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';

const routes: Route[] = [
  {
    path: 'result/:id',
    canActivate: [AuthGuard],
    component: Results
  },
  {
    path: 'history',
    canActivate: [AuthGuard],
    component: RunTestHistory
  },
  {
    path: 'history/:planId',
    canActivate: [AuthGuard],
    component: RunTestHistory
  },
  {
    path: ':id/:testRunId',
    canActivate: [AuthGuard],
    component: RunTestPlan
  }
];

@NgModule({
  declarations: [
    RunTestHistory,
    RunTestPlan,
    Results
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    NzCardModule,
    NzAffixModule,
    NzBadgeModule,
    NzUploadModule,
    NzIconModule,
    NzImageModule,
    NzButtonModule,
    NzRadioModule,
    NzFormModule,
    NzInputModule,
    NzTableModule,
    NzSelectModule,
    NzModalModule,
    NzUploadModule,
    NzListModule,
    NzDropDownModule,
    TestStatus,
    TestCaseDescription,
    ReactiveFormsModule,
    DurationCounter,
    CreateEdgeCaseIssueModal
]
})
export class RunTestPlanModule { }
