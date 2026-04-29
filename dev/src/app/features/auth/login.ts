import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  error: string | null = null;
  loading = false;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    const params = this.route.snapshot.queryParams;
    if (params['code'] && params['state'] && params['iss'] && params['scope']) {
      this.loading = true;
      try {
        await this.authService.verifyGoogleOauth({
          code: params['code'],
          state: params['state'],
          iss: params['iss'],
          scope: params['scope'],
        });

        this.router.navigate(['/onboarding']);
        // this.router.navigate(['/dashboard']);
      } catch (e) {
        this.error = 'Login failed. Please try again.';
        this.loading = false;
      }
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const res = await this.authService.getGoogleLoginUrl();
      window.location.href = res.data.url;
    } catch (e) {
      this.error = 'Could not reach login service. Please try again.';
      this.loading = false;
    }
  }
}
