import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { mergeMap, Observable, timer } from 'rxjs';
import { UserEditionModel, UserModel } from './user.models';

@Injectable({
  providedIn: 'root',
})
export class UserRepository {
  readonly USER_API_URL = 'http://localhost:3000/users';

  readonly #http = inject(HttpClient);

  getUsers(filters: Partial<UserEditionModel>): Observable<UserModel[]> {
    return timer(2000).pipe(
      mergeMap(() =>
        this.#http.get<UserModel[]>(this.USER_API_URL, {
          params: filters,
        }),
      ),
    );

    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // const response = await fetch(this.USER_API_URL);
    // return response.json();
  }

  createUser(user: UserModel): Observable<UserModel> {
    return timer(2000).pipe(
      mergeMap(() => this.#http.post<UserModel>(this.USER_API_URL, user)),
    );

    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // const response = await fetch(this.USER_API_URL, {
    //   method: 'POST',
    //   body: JSON.stringify(user),
    // });
    // return response.json();
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

    // await new PromiseRejectionEvent(resolve => setTimeout(resolve, 2000));
    // const response = await fetch(`${this.USER_API_URL}/${userId}`, {
    //   method: 'DELETE',
    // });
    // return response.json();
  }
}
