import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { USER_API_URL } from '@common/constants/api.constants';
import { Observable, switchMap, timer } from 'rxjs';
import { UserEditionModel, UserFiltersModel, UserModel } from './user.models';

@Injectable({
  providedIn: 'root',
})
export class UserRepository {
  readonly #http = inject(HttpClient);

  getUsers(filters: UserFiltersModel): Observable<UserModel[]> {
    const jsonServerFilters: {
      'name:contains'?: string;
      'email:contains'?: string;
      birthdate?: string;
    } = {};

    if (filters.name) {
      jsonServerFilters['name:contains'] = filters.name;
    }

    if (filters.email) {
      jsonServerFilters['email:contains'] = filters.email;
    }

    if (filters.birthdate && filters.birthdate !== 'Invalid Date') {
      jsonServerFilters['birthdate'] = filters.birthdate;
    }

    return timer(2000).pipe(
      switchMap(() =>
        this.#http.get<UserModel[]>(USER_API_URL, {
          params: jsonServerFilters,
        }),
      ),
    );

    // return this.#http.get<UserModel[]>(USER_API_URL, {
    //   params: jsonServerFilters,
    // });
  }

  createUser(userToCreate: UserEditionModel): Observable<UserModel> {
    return this.#http.post<UserModel>(USER_API_URL, userToCreate);
  }

  updateUser(userToUpdate: UserEditionModel): Observable<UserModel> {
    return this.#http.put<UserModel>(
      `${USER_API_URL}/${userToUpdate.id}`,
      userToUpdate,
    );
  }

  deleteUser(userIdToDelete: UserModel['id']): Observable<boolean> {
    return this.#http.delete<boolean>(`${USER_API_URL}/${userIdToDelete}`);
  }
}
