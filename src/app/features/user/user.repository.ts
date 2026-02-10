import { Injectable } from '@angular/core';
import { UserFiltersModel, UserModel } from './user.models';

@Injectable({
  providedIn: 'root',
})
export class UserRepository {
  readonly USER_API_URL = 'http://localhost:3000/users';

  async getUsers(filters: UserFiltersModel): Promise<UserModel[]> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const params = new URLSearchParams(filters);
    const response = await fetch(`${this.USER_API_URL}?${params.toString()}`);
    return response.json();
  }

  async createUser(user: UserModel): Promise<UserModel> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await fetch(this.USER_API_URL, {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return response.json();
  }

  async updateUser(user: UserModel): Promise<UserModel> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await fetch(`${this.USER_API_URL}/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
    return response.json();
  }

  async deleteUser(userId: UserModel['id']): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await fetch(`${this.USER_API_URL}/${userId}`, {
      method: 'DELETE',
    });
    return response.json();
  }
}
