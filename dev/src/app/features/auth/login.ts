import { Component } from '@angular/core';
import { AuthService } from './services/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    const google = (window as any).google;
    google.accounts.id.initialize({
      client_id: '116415773690-su14alhh82j1npnnkgo03j2omads43kn.apps.googleusercontent.com',
      callback: (r: any) => this.auth.authGoogle(r).subscribe(({ data }) => {
        localStorage.setItem('token', data.authGoogle.token);

        this.router.navigate(['/dashboard']);
      })
    });
    google.accounts.id.renderButton(
      document.getElementById('g_id_signin'),
      { theme: 'outline', size: 'large' } // Customize as needed
    );
  }
}
