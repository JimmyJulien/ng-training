export interface UserModel {
  id: string;
  name: string;
  email: string;
  birthdate: string;
  representant?: string;
  pets: string[];
  password: string;
}

export type UserEditionModel = Omit<UserModel, 'id'> & { id?: string };

export type UserFiltersModel = Partial<
  Pick<UserModel, 'name' | 'email' | 'birthdate'>
>;
