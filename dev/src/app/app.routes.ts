import { Routes } from '@angular/router';
import { Login } from '@qa/auth/login';
import { AuthGuard } from './guards/auth.guard';
import { Onboarding } from './features/onboarding/pages/onboarding';

export const routes: Routes = [
    {
        path: '',
        component: Login
    },
    {
        path: 'onboarding',
        canActivate: [AuthGuard],
        component: Onboarding
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard-module').then(m => m.DashboardModule)
    }
];
