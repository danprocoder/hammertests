import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { getCurrentUser } from 'aws-amplify/auth';


@Component({
  selector: 'app-login',
  imports: [
    AmplifyAuthenticatorModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  constructor(private router: Router) { }

  async ngOnInit(): Promise<void> {
    try {
      const user = await getCurrentUser();
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    } catch (err) { }
  }
}
