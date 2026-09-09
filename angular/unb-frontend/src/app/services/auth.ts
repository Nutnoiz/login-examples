import { Injectable } from '@angular/core';

import {
  LoginUser
} from './login';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private readonly storageKey = 'unb_current_user';

  setUser(user: LoginUser): void {

  console.log('AUTH: setUser called');
  console.log('AUTH: user =', user);

  const json = JSON.stringify(user);

  console.log('AUTH: json =', json);

  localStorage.setItem(
    this.storageKey,
    json
  );

  console.log(
    'AUTH: stored =',
    localStorage.getItem(this.storageKey)
  );
}

  getUser(): LoginUser | null {

  const data =
    localStorage.getItem(this.storageKey);

  console.log(
    'AUTH: getUser =',
    data
  );

  if (!data) {
    return null;
  }

  try {

    return JSON.parse(data) as LoginUser;

  } catch {

    localStorage.removeItem(
      this.storageKey
    );

    return null;
  }
}

  isLoggedIn(): boolean {

    return this.getUser() !== null;

  }

  logout(): void {

    localStorage.removeItem(
      this.storageKey
    );

  }
}