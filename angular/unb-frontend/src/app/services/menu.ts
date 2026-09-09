import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';


export interface MenuItem {

  menu_id: number;

  menu_name: string;

  page: string | null;

  icon: string | null;

  parent_id: number | null;

  sort_order: number;

}


export interface MenuResponse {

  success: boolean;

  message: string;

  menus: MenuItem[];

}


@Injectable({
  providedIn: 'root'
})
export class Menu {

  private readonly apiUrl =
    'http://localhost:8000/menu.php';


  constructor(
    private http: HttpClient
  ) {}


  getMenu(
  userId: number,
  roleId: number
): Observable<MenuResponse> {

  const url =
    `${this.apiUrl}?user_id=${userId}&role_id=${roleId}`;

  console.log('MENU URL:', url);

  return this.http.get<MenuResponse>(
    url
  );

}

}

