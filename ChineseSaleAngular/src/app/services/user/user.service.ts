import { Injectable } from '@angular/core';
import { environment } from '../../enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, CreateUser, UpdateUser, LoginRequest, LoginResponse } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly url = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  login(login:LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/login`, login);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  getUsersWithPagination(pageNumber: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);
    return this.http.get<any>(`${this.url}/pagination`, { params });
  }

  registerUser(user: CreateUser): Observable<User> {
    return this.http.post<User>(`${this.url}/register`, user);
  }

  updateUser(user: UpdateUser): Observable<void> {
    return this.http.put<void>(this.url, user);
  }
}
