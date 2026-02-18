import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { USER_API_URL } from '@common/constants/api.constants';
import { Observable } from 'rxjs';
import { UserFiltersModel, UserModel } from './user.models';

@Injectable({
  providedIn: 'root',
})
export class UserRepository {
  readonly #http = inject(HttpClient);

  getUsers(filters: UserFiltersModel): Observable<UserModel[]> {
    return this.#http.get<UserModel[]>(USER_API_URL, {
      params: filters,
    });
  }

  createUser(user: UserModel): Observable<UserModel> {
    return this.#http.post<UserModel>(USER_API_URL, user);
  }

  updateUser(user: UserModel): Observable<UserModel> {
    return this.#http.put<UserModel>(`${USER_API_URL}/${user.id}`, user);
  }

  deleteUser(userId: UserModel['id']): Observable<boolean> {
    return this.#http.delete<boolean>(`${USER_API_URL}/${userId}`);
  }
}
