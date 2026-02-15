import { UserModel } from '@features/user/user.models';

export const USER: UserModel = {
  id: crypto.randomUUID(),
  name: 'USER',
  email: 'user@mail.fr',
  birthdate: new Date(1, 1, 2001).toDateString(),
  pets: [],
  password: '00000000',
};

export const USER_WITH_PETS: UserModel = {
  id: crypto.randomUUID(),
  name: 'USER WITH PETS',
  email: 'user_with_pets@mail.fr',
  birthdate: new Date(1, 1, 2001).toDateString(),
  pets: ['PET1', 'PET2', 'PET3'],
  password: 'petpetpet',
};

export const USER_UNDER_16: UserModel = {
  id: crypto.randomUUID(),
  name: 'USER UNDER 16',
  email: 'user_under_16@mail.fr',
  birthdate: new Date().toDateString(),
  representant: 'USER OVER 16',
  pets: [],
  password: '16161616',
};
