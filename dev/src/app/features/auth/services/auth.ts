import { Injectable } from "@angular/core";

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'https://pmv2api-development-live.up.railway.app';

  constructor() { }

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setAccessToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  clearAccessToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  async getGoogleLoginUrl(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/oauth/google/login-url`);
    if (!response.ok) {
      throw new Error('Failed to get Google login URL');
    }
    const data = await response.json();
    return data.url ?? data;
  }

  async verifyGoogleOauth(params: { code: string; state: string; iss: string; scope: string }): Promise<void> {
    const response = await fetch(`${this.baseUrl}/oauth/google/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error('Google OAuth verification failed');
    }
    const data = await response.json();
    const token = data.access_token ?? data.token ?? data;
    if (typeof token === 'string') {
      this.setAccessToken(token);
    }
  }
}
