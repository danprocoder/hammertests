import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl;

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

  async getGoogleLoginUrl(): Promise<{ data: { url: string } }> {
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
    const res = await response.json();
    const token = res.data.token;
    if (typeof token === 'string') {
      this.setAccessToken(token);
    }
  }
}
