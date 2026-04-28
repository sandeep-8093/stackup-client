import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

export interface JwtPayload {
  id: string;
  name: string;
  avatar?: string;
  exp: number;
  iat: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'jwtToken';

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  decodeToken(token: string): JwtPayload {
    return jwt_decode<JwtPayload>(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      return decoded.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }
}
