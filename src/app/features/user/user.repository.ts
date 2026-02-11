import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { mergeMap, Observable, timer } from 'rxjs';
import { UserFiltersModel, UserModel } from './user.models';

@Injectable({
  providedIn: 'root',
})
export class UserRepository {
  readonly USER_API_URL = 'http://localhost:3000/users';

  readonly #http = inject(HttpClient);

  getUsers(filters: UserFiltersModel): Observable<UserModel[]> {
    return timer(2000).pipe(
      mergeMap(() =>
        this.#http.get<UserModel[]>(this.USER_API_URL, {
          params: filters,
        }),
      ),
    );
  }

  createUser(user: UserModel): Observable<UserModel> {
    return timer(2000).pipe(
      mergeMap(() => this.#http.post<UserModel>(this.USER_API_URL, user)),
    );
  }

  updateUser(user: UserModel): Observable<UserModel> {
    return timer(2000).pipe(
      mergeMap(() =>
        this.#http.put<UserModel>(`${this.USER_API_URL}/${user.id}`, user),
      ),
    );
  }

  deleteUser(userId: UserModel['id']): Observable<boolean> {
    return timer(2000).pipe(
      mergeMap(() =>
        this.#http.delete<boolean>(`${this.USER_API_URL}/${userId}`),
      ),
    );
  }
}
