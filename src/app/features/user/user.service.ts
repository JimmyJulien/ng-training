import { inject, Injectable } from '@angular/core';
import { UserModel } from './user.models';
import { UserRepository } from './user.repository';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly #userRepository = inject(UserRepository);

  async getUserByName(name: UserModel['name']): Promise<UserModel | null> {
    const users = await this.#userRepository.getUsers({ name });
    return users[0] ?? null;
  }

  async existUserByName(name: UserModel['name']): Promise<boolean> {
    const user = await this.getUserByName(name);
    return !!user;
  }
}
