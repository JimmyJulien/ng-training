import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { screen, waitFor } from '@testing-library/angular';
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
import { UserFiltersModel, UserModel } from '../user.models';
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
      httpGet({
        httpTesting,
        apiUrl: USER_API_URL,
        params: filters,
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
    userToCreate: UserModel;
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
    userToUpdate: UserModel;
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

  const typeEditionName = async (value: string) => {
    const d = await dialog();

    return typeInInput({
      label: /Name/,
      value,
      container: d,
    });
  };

  const typeEditionEmail = async (value: string) => {
    const d = await dialog();

    return typeInInput({
      label: /Email/,
      value,
      container: d,
    });
  };

  const typeEditionBirthdate = async (value: string) => {
    const d = await dialog();

    return typeInInput({
      label: /Birth Date/,
      value,
      container: d,
    });
  };

  const typeEditionRepresentant = async (value: string) => {
    const d = await dialog();

    return typeInInput({
      label: /Representant/,
      value,
      container: d,
    });
  };

  const typeEditionPassword = async (value: string) => {
    const d = await dialog();

    return typeInInput({
      label: 'Password',
      value,
      container: d,
    });
  };

  const typeEditionConfirmPassword = async (value: string) => {
    const d = await dialog();

    return typeInInput({
      label: /Confirm password/,
      value,
      container: d,
    });
  };

  const submitEdition = async () => {
    const d = await dialog();
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

  const checkNoResult = async () => {
    const u = await user(/No result/);
    expect(u).toBeDefined();
  };

  const checkAlert = async () => {
    const alert = await screen.findByText(/Error/);
    expect(alert).toBeDefined();
  };

  return {
    httpTesting,
    createButton,
    createUser,
    getUsers,
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
    updateUser,
    deleteUser,
    checkAlert,
    checkNoResult,
    checkUser,
    checkNoUser,
    clickFilter,
    typeFilterBirthdate,
    typeFilterEmail,
    typeFilterName,
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

  test('should show no result', async () => {
    const { httpTesting, getUsers, checkNoResult } = await setup();

    await getUsers({ filters: {}, users: [] });

    await checkNoResult();

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

    await getUsers({
      filters: {},
      users: [USER, USER_UNDER_16, USER_WITH_PETS],
    });

    await typeFilterName(USER.name);
    await typeFilterEmail(USER.email);
    await typeFilterBirthdate(USER.birthdate);

    await clickFilter();

    await getUsers({
      filters: {
        name: USER.name,
        email: USER.email,
        birthdate: USER.birthdate,
      },
      users: [USER],
    });

    await checkUser(USER.name);

    httpTesting.verify();
  });

  test('should create a user', async () => {
    const {
      httpTesting,
      getUsers,
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

    const initialUsers: UserModel[] = [];

    await getUsers({ filters: {}, users: initialUsers });

    const userToCreate: UserModel = { ...USER, id: '' };

    await clickCreate();

    await typeEditionName(userToCreate.name);

    await getUsers({
      filters: { name: userToCreate.name },
      users: [],
    });

    await typeEditionEmail(userToCreate.email);
    await typeEditionBirthdate(userToCreate.birthdate);
    await typeEditionPassword(userToCreate.password);
    await typeEditionConfirmPassword(userToCreate.password);

    await submitEdition();

    await createUser({ userToCreate, userCreated: USER });

    await getUsers({ filters: {}, users: [...initialUsers, USER] });

    await checkUser(USER.name);

    httpTesting.verify();
  });

  test('should update a user', async () => {
    const {
      httpTesting,
      getUsers,
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

    // Note: validateur async se déclenche immédiatement
    await getUsers({
      filters: { name: userToUpdate.name },
      users: [userToUpdate],
    });

    const addedToUserName = 'UPDATED';

    // Note: ajoute à l'existant donc USER -> USERUPDATED
    await typeEditionName(addedToUserName);

    userToUpdate.name = `${userToUpdate.name}${addedToUserName}`;

    await getUsers({ filters: { name: userToUpdate.name }, users: [] });

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

    const initialUsers: UserModel[] = [];

    await getUsers({ filters: {}, users: initialUsers });

    const userToCreate: UserModel = { ...USER_UNDER_16, id: '' };

    await clickCreate();

    await typeEditionName(userToCreate.name);

    await getUsers({
      filters: { name: userToCreate.name },
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
});
