import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  clean(): void {
    window.sessionStorage.clear()
  }

  // user data
  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY)
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY)
    if (user) {
      return JSON.parse(user)
    }
    return {}
  }

  // token
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token)
  }

  public getToken(): any {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY)
    if (user) {
      return true
    }
    return false
  }
}
