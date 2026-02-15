import { UserFiltersModel, UserModel } from '@features/user/user.models';
import {
  USER,
  USER_UNDER_16,
  USER_WITH_PETS,
} from '@testing/data/testing.data';
import { Observable, of } from 'rxjs';

export class UserTestingRepository {
  userList: UserModel[] = [USER, USER_UNDER_16, USER_WITH_PETS];

  getUsers(filters: UserFiltersModel): Observable<UserModel[]> {
    console.log(this.getUsers.name, filters);

    const filteredUserList: UserModel[] = this.userList.filter((u) => {
      if (filters.name && u.name !== filters.name) {
        return false;
      }

      if (filters.email && u.email !== filters.email) {
        return false;
      }

      if (filters.birthdate && u.birthdate !== filters.birthdate) {
        return false;
      }

      return true;
    });

    console.log('filteredUsers', filteredUserList);

    return of(filteredUserList);
  }

  createUser(user: UserModel): Observable<UserModel> {
    console.log(this.createUser.name, user);

    this.userList = [...this.userList, { ...user, id: crypto.randomUUID() }];
    return of(user);
  }

  updateUser(user: UserModel): Observable<UserModel> {
    console.log(this.updateUser.name, user);

    this.userList = this.userList.map((u) => (u.id == user.id ? user : u));
    return of(user);
  }

  deleteUser(userId: UserModel['id']): Observable<boolean> {
    console.log(this.deleteUser.name, userId);

    this.userList = this.userList.filter((u) => u.id !== userId);
    return of(!!userId);
  }
}
