import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { screen, waitFor, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { USER_API_URL } from '@testing/constants/testing.constants';
import {
  USER,
  USER_UNDER_16,
  USER_WITH_PETS,
} from '@testing/data/testing.data';
import {
  clickButton,
  dialog,
  form,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  renderApp,
  typeInInput,
} from '@testing/utils/testing.utils';
import { UserEditionModel, UserFiltersModel, UserModel } from '../user.models';
import { UserSearchingPage } from './user-searching.page';

const setup = async () => {
  await renderApp({
    routes: [
      {
        path: '',
        component: UserSearchingPage,
      },
    ],
  });

  const httpTesting = TestBed.inject(HttpTestingController);

  const getUsers = async ({
    filters,
    users,
    error,
  }: {
    filters: UserFiltersModel;
    users?: UserModel[];
    error?: { message: string; status: number; statusText: string };
  }) => {
    await waitFor(() => {
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

      httpGet({
        httpTesting,
        apiUrl: USER_API_URL,
        params: jsonServerFilters,
        successData: users,
        errorData: error,
      });
    });
  };

  const getUserByName = async ({
    name,
    users,
    error,
  }: {
    name: UserModel['name'];
    users?: UserModel[];
    error?: { message: string; status: number; statusText: string };
  }) => {
    await waitFor(() => {
      httpGet({
        httpTesting,
        apiUrl: USER_API_URL,
        params: { name },
        successData: users,
        errorData: error,
      });
    });
  };

  const createUser = async ({
    userToCreate,
    userCreated,
    error,
  }: {
    userToCreate: UserEditionModel;
    userCreated?: UserModel;
    error?: { message: string; status: number; statusText: string };
  }) => {
    await waitFor(() => {
      httpPost({
        httpTesting,
        apiUrl: USER_API_URL,
        body: userToCreate,
        successData: userCreated,
        errorData: error,
      });
    });
  };

  const updateUser = async ({
    userToUpdate,
    updatedUser,
    error,
  }: {
    userToUpdate: UserEditionModel;
    updatedUser?: UserModel;
    error?: { message: string; status: number; statusText: string };
  }) => {
    await waitFor(() => {
      httpPut({
        httpTesting,
        apiUrl: `${USER_API_URL}/${userToUpdate.id}`,
        body: userToUpdate,
        successData: updatedUser,
        errorData: error,
      });
    });
  };

  const deleteUser = async ({
    userIdToDelete,
    deletionResult,
    error,
  }: {
    userIdToDelete: UserModel['id'];
    deletionResult?: boolean;
    error?: { message: string; status: number; statusText: string };
  }) => {
    await waitFor(() => {
      httpDelete({
        httpTesting,
        apiUrl: `${USER_API_URL}/${userIdToDelete}`,
        successData: deletionResult,
        errorData: error,
      });
    });
  };

  const user = async (name: string | RegExp) => {
    return screen.findByText(name);
  };

  const createButton = async () => {
    return screen.findByTestId('create-button');
  };

  const clickCreate = async () => {
    const b = await createButton();
    return userEvent.click(b);
  };

  const clickDelete = async (name: string) => {
    return clickButton({
      label: `Delete user ${name}`,
    });
  };

  const clickEdit = async (name: string) => {
    return clickButton({
      label: `Edit user ${name}`,
    });
  };

  const typeFilterName = async (value: string) => {
    const f = await form();

    return typeInInput({
      label: /Name/,
      value,
      container: f,
    });
  };

  const typeFilterEmail = async (value: string) => {
    const f = await form();

    return typeInInput({
      label: /Email/,
      value,
      container: f,
    });
  };

  const typeFilterBirthdate = async (value: string) => {
    const f = await form();

    return typeInInput({
      label: /Birth Date/,
      value,
      container: f,
    });
  };

  const clickFilter = async () => {
    const f = await form();

    return clickButton({
      label: /Filter/,
      container: f,
    });
  };

  const editionDialog = async () => {
    return screen.findByTestId('user-edition-dialog');
  };

  const typeEditionName = async (value: string) => {
    return typeInInput({
      label: /Name/,
      value,
      container: await editionDialog(),
    });
  };

  const typeEditionEmail = async (value: string) => {
    return typeInInput({
      label: /Email/,
      value,
      container: await editionDialog(),
    });
  };

  const typeEditionBirthdate = async (value: string) => {
    return typeInInput({
      label: /Birth Date/,
      value,
      container: await editionDialog(),
    });
  };

  const typeEditionRepresentant = async (value: string) => {
    return typeInInput({
      label: /Representant/,
      value,
      container: await editionDialog(),
    });
  };

  const typeEditionPassword = async (value: string) => {
    return typeInInput({
      label: 'Password',
      value,
      container: await editionDialog(),
    });
  };

  const typeEditionConfirmPassword = async (value: string) => {
    return typeInInput({
      label: /Confirm password/,
      value,
      container: await editionDialog(),
    });
  };

  const typeEditionPet = async ({
    index,
    value,
  }: {
    index: number;
    value: string;
  }) => {
    return typeInInput({
      label: `Pet ${index + 1}`,
      value,
      container: await editionDialog(),
    });
  };

  const addEditionPet = async () => {
    const d = await editionDialog();
    const buttons = await within(d).findAllByRole('button', {
      name: /Add a pet/,
    });
    const lastButton = buttons[buttons.length - 1];
    return userEvent.click(lastButton);
  };

  const removeEditionPet = async () => {
    const d = await editionDialog();
    const buttons = await within(d).findAllByRole('button', {
      name: /Remove a pet/,
    });
    const lastButton = buttons[buttons.length - 1];
    return userEvent.click(lastButton);
  };

  const submitEdition = async () => {
    const d = await editionDialog();
    return clickButton({ label: /Submit/, container: d });
  };

  const confirmDeletion = async () => {
    const d = await dialog();
    return clickButton({ label: /Yes/, container: d });
  };

  const checkUser = async (name: string | RegExp) => {
    const u = await user(name);
    expect(u).toBeDefined();
  };

  const checkNoUser = async (name: string | RegExp) => {
    await waitForAsync(async () => {
      const u = await user(name);
      expect(u).toBeUndefined();
    });
  };

  const checkNoData = async () => {
    const u = await user(/No data found/);
    expect(u).toBeDefined();
  };

  const checkAlert = async () => {
    const alert = await screen.findByText(/Error fetching users/);
    expect(alert).toBeDefined();
  };

  return {
    httpTesting,
    createButton,
    createUser,
    getUsers,
    getUserByName,
    clickCreate,
    clickDelete,
    clickEdit,
    submitEdition,
    confirmDeletion,
    typeEditionName,
    typeEditionEmail,
    typeEditionBirthdate,
    typeEditionRepresentant,
    typeEditionPassword,
    typeEditionConfirmPassword,
    typeEditionPet,
    updateUser,
    deleteUser,
    checkAlert,
    checkNoData,
    checkUser,
    checkNoUser,
    clickFilter,
    typeFilterBirthdate,
    typeFilterEmail,
    typeFilterName,
    addEditionPet,
    removeEditionPet,
  };
};

describe('UserSearchingPage', () => {
  test('should show 3 users', async () => {
    const { httpTesting, getUsers, checkUser } = await setup();

    await getUsers({
      filters: {},
      users: [USER, USER_UNDER_16, USER_WITH_PETS],
    });

    await checkUser(USER.name);
    await checkUser(USER_UNDER_16.name);
    await checkUser(USER_WITH_PETS.name);

    httpTesting.verify();
  });

  test('should show no data found message', async () => {
    const { httpTesting, getUsers, checkNoData } = await setup();

    await getUsers({ filters: {}, users: [] });

    await checkNoData();

    httpTesting.verify();
  });

  test('should show an error alert', async () => {
    const { httpTesting, getUsers, checkAlert } = await setup();

    await getUsers({
      filters: {},
      error: { message: 'Error', status: 500, statusText: 'Server error' },
    });

    await checkAlert();

    httpTesting.verify();
  });

  test('should filter users', async () => {
    const {
      httpTesting,
      getUsers,
      checkUser,
      typeFilterName,
      typeFilterEmail,
      typeFilterBirthdate,
      clickFilter,
    } = await setup();

    const initialUsers: UserModel[] = [USER, USER_UNDER_16, USER_WITH_PETS];

    await getUsers({
      filters: {},
      users: [USER, USER_UNDER_16, USER_WITH_PETS],
    });

    const selectedUser = initialUsers[2];

    await typeFilterName(selectedUser.name);
    await typeFilterEmail(selectedUser.email);
    await typeFilterBirthdate(selectedUser.birthdate);

    await clickFilter();

    await getUsers({
      filters: {
        name: selectedUser.name,
        email: selectedUser.email,
        birthdate: selectedUser.birthdate,
      },
      users: [selectedUser],
    });

    await checkUser(selectedUser.name);

    httpTesting.verify();
  });

  test('should create a user', async () => {
    const {
      httpTesting,
      getUsers,
      getUserByName,
      clickCreate,
      createUser,
      typeEditionName,
      typeEditionEmail,
      typeEditionBirthdate,
      typeEditionPassword,
      typeEditionConfirmPassword,
      submitEdition,
      checkUser,
    } = await setup();

    const initialUsers: UserModel[] = [USER];

    // Récupération de la liste d'utilisateur initiale
    await getUsers({ filters: {}, users: initialUsers });

    const userToCreate: UserEditionModel = { ...USER, id: undefined };

    await clickCreate();

    // Récupération des représentants
    await getUsers({
      filters: {},
      users: initialUsers,
    });

    await typeEditionName(userToCreate.name);

    // Vérification existence nom
    await getUserByName({
      name: userToCreate.name,
      users: [],
    });

    await typeEditionEmail(userToCreate.email);
    await typeEditionBirthdate(userToCreate.birthdate);
    await typeEditionPassword(userToCreate.password);
    await typeEditionConfirmPassword(userToCreate.password);

    await submitEdition();

    // Création du nouvel utilisateur
    await createUser({ userToCreate, userCreated: USER });

    // Récupération de la liste d'utilisateur à jour
    await getUsers({ filters: {}, users: [...initialUsers, USER] });

    await checkUser(USER.name);

    httpTesting.verify();
  });

  test('should update a user', async () => {
    const {
      httpTesting,
      getUsers,
      getUserByName,
      clickEdit,
      typeEditionName,
      submitEdition,
      updateUser,
      checkUser,
    } = await setup();

    const initialUsers: UserModel[] = [USER];

    await getUsers({ filters: {}, users: initialUsers });

    const userToUpdate: UserModel = initialUsers[0];

    await clickEdit(userToUpdate.name);

    // Récupération des représentants
    await getUsers({
      filters: {},
      users: initialUsers,
    });

    // Note: validateur async se déclenche immédiatement
    await getUserByName({
      name: userToUpdate.name,
      users: [USER],
    });

    const addedToUserName = 'UPDATED';

    // Note: ajoute à l'existant donc USER -> USERUPDATED
    await typeEditionName(addedToUserName);

    userToUpdate.name = `${userToUpdate.name}${addedToUserName}`;

    await getUserByName({
      name: userToUpdate.name,
      users: [],
    });

    await submitEdition();

    await updateUser({ userToUpdate, updatedUser: userToUpdate });

    await getUsers({ filters: {}, users: [userToUpdate] });

    await checkUser(userToUpdate.name);

    httpTesting.verify();
  });

  test('should delete a user', async () => {
    const {
      httpTesting,
      getUsers,
      clickDelete,
      confirmDeletion,
      deleteUser,
      checkNoUser,
    } = await setup();

    const initialUsers: UserModel[] = [USER];

    await getUsers({ filters: {}, users: initialUsers });

    const userToDelete: UserModel = initialUsers[0];

    await clickDelete(userToDelete.name);

    await confirmDeletion();

    await deleteUser({ userIdToDelete: userToDelete.id, deletionResult: true });

    await getUsers({ filters: {}, users: [] });

    await checkNoUser(USER.name);

    httpTesting.verify();
  });

  test('should create a user under 16', async () => {
    const {
      httpTesting,
      getUsers,
      getUserByName,
      clickCreate,
      createUser,
      typeEditionName,
      typeEditionEmail,
      typeEditionBirthdate,
      typeEditionRepresentant,
      typeEditionPassword,
      typeEditionConfirmPassword,
      submitEdition,
      checkUser,
    } = await setup();

    const initialUsers: UserModel[] = [USER];

    await getUsers({ filters: {}, users: initialUsers });

    const userToCreate: UserEditionModel = { ...USER_UNDER_16, id: undefined };

    await clickCreate();

    // Récupération des représentants
    await getUsers({
      filters: {},
      users: initialUsers,
    });

    await typeEditionName(userToCreate.name);

    await getUserByName({
      name: userToCreate.name,
      users: [],
    });

    await typeEditionEmail(userToCreate.email);
    await typeEditionBirthdate(userToCreate.birthdate);
    await typeEditionRepresentant(userToCreate.representant!);
    await typeEditionPassword(userToCreate.password);
    await typeEditionConfirmPassword(userToCreate.password);

    await submitEdition();

    await createUser({ userToCreate, userCreated: USER_UNDER_16 });

    await getUsers({ filters: {}, users: [...initialUsers, USER_UNDER_16] });

    await checkUser(USER_UNDER_16.name);

    httpTesting.verify();
  });

  test('should create a user with a pet', async () => {
    const {
      httpTesting,
      getUsers,
      getUserByName,
      clickCreate,
      createUser,
      typeEditionName,
      typeEditionEmail,
      typeEditionBirthdate,
      typeEditionPassword,
      typeEditionConfirmPassword,
      typeEditionPet,
      submitEdition,
      checkUser,
      addEditionPet,
    } = await setup();

    const initialUsers: UserModel[] = [USER];

    await getUsers({ filters: {}, users: initialUsers });

    const userToCreate: UserEditionModel = { ...USER_WITH_PETS, id: undefined };

    await clickCreate();

    // Récupération des représentants
    await getUsers({
      filters: {},
      users: initialUsers,
    });

    await typeEditionName(userToCreate.name);

    await getUserByName({
      name: userToCreate.name,
      users: [],
    });

    await typeEditionEmail(userToCreate.email);
    await typeEditionBirthdate(userToCreate.birthdate);
    await typeEditionPassword(userToCreate.password);
    await typeEditionConfirmPassword(userToCreate.password);
    await typeEditionPet({
      index: 0,
      value: userToCreate.pets[0],
    });
    await addEditionPet();
    await typeEditionPet({
      index: 1,
      value: userToCreate.pets[1],
    });
    await addEditionPet();
    await typeEditionPet({
      index: 2,
      value: userToCreate.pets[2],
    });

    await submitEdition();

    await createUser({ userToCreate, userCreated: USER_WITH_PETS });

    await getUsers({ filters: {}, users: [...initialUsers, USER_WITH_PETS] });

    await checkUser(USER_WITH_PETS.name);

    httpTesting.verify();
  });
});
