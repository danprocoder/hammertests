import { NgModule } from '@angular/core';
import { Dashboard } from './dashboard';
import { Route, RouterModule } from '@angular/router';
import { EditTestPlan } from '@qa/test-plan/pages/edit-test-plan/edit-test-plan';
import { StartTestRun } from '@qa/test-run/pages/start-test-run/start-test-run';
import { Navbar } from '@qa/components/navbar/navbar';
import { TestPlans } from '@qa/test-plan/pages/test-plans/test-plans';
import { ViewTestPlan } from '@qa/test-plan/pages/view-test-plan/view-test-plan';
import { Container } from '@qa/components/container/container';
import { AuthGuard } from '../../guards/auth.guard';
import { CanDeactivatePage } from '../../guards/can-deactivate.guard';

const routes: Route[] = [
  {
    path: '',
    component: Container,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: TestPlans,
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: EditTestPlan,
      },
      {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivatePage],
        component: EditTestPlan,
      },
      {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ViewTestPlan,
      },
      {
        path: 'start/:id',
        canActivate: [AuthGuard],
        component: StartTestRun
      },
      {
        path: 'run',
        loadChildren: () => import('../test-run/run-test-plan-module').then((m) => m.RunTestPlanModule)
      }
    ]
  }
];

@NgModule({
  declarations: [Dashboard],
  imports: [
    Navbar,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
