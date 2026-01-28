import { Injectable } from '@angular/core';
import { environment } from '../../enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, CreateUser, UpdateUser } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly url = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, {
      userName: username,
      password: password
    });
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
