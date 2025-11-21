import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  getAccessToken(): string | null {
    const username = localStorage.getItem('CognitoIdentityServiceProvider.51f7k8m5p1iff8hujdabed4nlb.LastAuthUser');

    if (username) {
      return localStorage.getItem(`CognitoIdentityServiceProvider.51f7k8m5p1iff8hujdabed4nlb.${username}.accessToken`);
    }

    return null;
  }
}
