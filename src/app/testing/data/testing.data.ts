import { UserModel } from '@features/user/user.models';

export const USER: UserModel = {
  id: crypto.randomUUID(),
  name: 'USER',
  email: 'user@mail.fr',
  birthdate: '01/01/1991',
  pets: [],
  password: '00000000',
};

export const USER_WITH_PETS: UserModel = {
  id: crypto.randomUUID(),
  name: 'USER_WITH_PETS',
  email: 'user_with_pets@mail.fr',
  birthdate: '02/02/1992',
  pets: ['PET1', 'PET2', 'PET3'],
  password: 'petpetpet',
};

export const USER_UNDER_16: UserModel = {
  id: crypto.randomUUID(),
  name: 'USER_UNDER_16',
  email: 'user_under_16@mail.fr',
  birthdate: '01/01/2016',
  representant: 'USER',
  pets: [],
  password: '16161616',
};
