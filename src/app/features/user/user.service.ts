import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserModel } from './user.models';
import { UserRepository } from './user.repository';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly #userRepository = inject(UserRepository);

  // TODO JJN others methodes CRUD

  getUserByName(name: UserModel['name']): Observable<UserModel | null> {
    return this.#userRepository
      .getUsers({ name })
      .pipe(map((users) => users[0] ?? null));
  }

  existUserByName(name: UserModel['name']): Observable<boolean> {
    return this.getUserByName(name).pipe(map((user) => !!user));
  }
}
