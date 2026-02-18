import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import {
  USER,
  USER_UNDER_16,
  USER_WITH_PETS,
} from '@testing/data/testing.data';
import {
  button,
  clickButton,
  dialog,
  renderApp,
  typeInInput,
} from '@testing/utils/testing.utils';
import { UserFiltersModel, UserModel } from '../user.models';
import { UserSearchingPage } from './user-searching.page';

const setup = async () => {
  const renderResult = await renderApp({
    routes: [
      {
        path: '',
        component: UserSearchingPage,
      },
    ],
  });

  const httpTesting = TestBed.inject(HttpTestingController);

  const USER_API_URL = 'http://localhost:3000/users';

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
      let url = USER_API_URL;

      if (Object.keys(filters).length > 0) {
        const searchParams = new URLSearchParams(filters);
        url += `?${searchParams}`;
      }

      const req = httpTesting.expectOne({
        method: 'GET',
        url,
      });

      if (users) {
        req.flush(users);
      }

      if (error) {
        const { message, status, statusText } = error;
        req.flush(message, { status, statusText });
      }
    });
  };

  const createUser = async ({
    user,
    error,
  }: {
    user?: UserModel;
    error?: { message: string; status: number; statusText: string };
  }) => {
    await waitFor(() => {
      const req = httpTesting.expectOne({
        method: 'POST',
        url: USER_API_URL,
      });

      if (user) {
        req.flush(user);
      }

      if (error) {
        const { message, status, statusText } = error;
        req.flush(message, { status, statusText });
      }
    });
  };

  const updateUser = async ({
    user,
    error,
  }: {
    user?: UserModel;
    error?: { message: string; status: number; statusText: string };
  }) => {
    await waitFor(() => {
      let url = USER_API_URL;

      if (user) {
        url += `/${user.id}`;
      }

      const req = httpTesting.expectOne({
        method: 'PUT',
        url,
      });

      if (user) {
        req.flush(user);
      }

      if (error) {
        const { message, status, statusText } = error;
        req.flush(message, { status, statusText });
      }
    });
  };

  const deleteUser = async ({
    user,
    error,
  }: {
    user?: UserModel;
    error?: { message: string; status: number; statusText: string };
  }) => {
    await waitFor(() => {
      let url = USER_API_URL;

      if (user) {
        url += `/${user.id}`;
      }

      const req = httpTesting.expectOne({
        method: 'DELETE',
        url,
      });

      if (user) {
        req.flush(true);
      }

      if (error) {
        const { message, status, statusText } = error;
        req.flush(message, { status, statusText });
      }
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

  const editionDialog = () => {
    return dialog();
  };

  const typeName = async (value: string) => {
    const d = await dialog();

    return typeInInput({
      label: /Name/,
      value,
      container: d,
      options: {
        delay: 50,
      },
    });
  };

  const typeEmail = async (value: string) => {
    const d = await dialog();

    return typeInInput({
      label: /Email/,
      value,
      container: d,
    });
  };

  const typeBirthdate = async (value: string) => {
    const d = await dialog();

    return typeInInput({
      label: /Birth Date/,
      value,
      container: d,
    });
  };

  const typePassword = async (value: string) => {
    const d = await dialog();

    return typeInInput({
      label: 'Password',
      value,
      container: d,
    });
  };

  const typeConfirmPassword = async (value: string) => {
    const d = await dialog();

    return typeInInput({
      label: /Confirm Password/,
      value,
      container: d,
    });
  };

  const submitButton = async () => {
    const d = await dialog();
    return button({ label: /Submit/, container: d });
  };

  const clickSubmit = async () => {
    const d = await dialog();
    return clickButton({ label: /Submit/, container: d });
  };

  const clickYes = async () => {
    const d = await dialog();
    return clickButton({ label: /Yes/, container: d });
  };

  return {
    httpTesting,
    renderResult,
    createButton,
    createUser,
    getUsers,
    editionDialog,
    user,
    clickCreate,
    clickDelete,
    clickEdit,
    clickSubmit,
    clickYes,
    submitButton,
    typeName,
    typeEmail,
    typeBirthdate,
    typePassword,
    typeConfirmPassword,
    updateUser,
    deleteUser,
  };
};

describe('UserSearchingPage', () => {
  test('should show 3 users', async () => {
    const { httpTesting, getUsers, user } = await setup();

    await getUsers({
      filters: {},
      users: [USER, USER_UNDER_16, USER_WITH_PETS],
    });

    const user1 = await user(USER.name);
    const user2 = await user(USER_UNDER_16.name);
    const user3 = await user(USER_WITH_PETS.name);

    expect(user1).toBeDefined();
    expect(user2).toBeDefined();
    expect(user3).toBeDefined();

    httpTesting.verify();
  });

  test('should show no result', async () => {
    const { httpTesting, getUsers, user } = await setup();

    await getUsers({ filters: {}, users: [] });

    const noResult = await user(/No result/);

    expect(noResult).toBeDefined();

    httpTesting.verify();
  });

  test('should show an error alert', async () => {
    const { httpTesting, getUsers } = await setup();

    await getUsers({
      filters: {},
      error: { message: 'Error', status: 500, statusText: 'Server error' },
    });

    const alert = await screen.findByText(/Error/);

    expect(alert).toBeDefined();

    httpTesting.verify();
  });

  test('should create a user', async () => {
    const {
      httpTesting,
      getUsers,
      user,
      clickCreate,
      clickSubmit,
      createUser,
      typeName,
      typeEmail,
      typeBirthdate,
      typePassword,
      typeConfirmPassword,
    } = await setup();

    await getUsers({ filters: {}, users: [] });

    const userToCreate: UserModel = USER;

    await waitForAsync(async () => {
      const newUser = await user(userToCreate.name);
      expect(newUser).toBeUndefined();
    });

    await clickCreate();

    await typeName(userToCreate.name);

    await getUsers({
      filters: { name: userToCreate.name },
      users: [],
    });

    await typeEmail(userToCreate.email);
    await typeBirthdate(userToCreate.birthdate);
    await typePassword(userToCreate.password);
    await typeConfirmPassword(userToCreate.password);

    await clickSubmit();

    await createUser({ user: userToCreate });

    await getUsers({ filters: {}, users: [userToCreate] });

    await waitForAsync(async () => {
      const newUser = await user(userToCreate.name);
      expect(newUser).toBeDefined();
    });

    httpTesting.verify();
  });

  test('should update a user', async () => {
    const {
      httpTesting,
      getUsers,
      clickEdit,
      typeName,
      user,
      clickSubmit,
      updateUser,
    } = await setup();

    await getUsers({ filters: {}, users: [USER] });

    await clickEdit(USER.name);

    // Note: validateur async se déclenche immédiatement
    await getUsers({
      filters: { name: USER.name },
      users: [USER],
    });

    const addedToUserName = 'UPDATED';

    // Note: ajoute à l'existant donc USER -> USERUPDATED
    await typeName(addedToUserName);

    const newUserName = `${USER.name}${addedToUserName}`;

    await getUsers({ filters: { name: newUserName }, users: [] });

    await clickSubmit();

    const updatedUser: UserModel = { ...USER, name: newUserName };

    await updateUser({ user: updatedUser });

    await getUsers({ filters: {}, users: [updatedUser] });

    await waitForAsync(async () => {
      const oldUser = await user(USER.name);
      expect(oldUser).toBeUndefined();
      const updatedUser = await user(newUserName);
      expect(updatedUser).toBeDefined();
    });

    httpTesting.verify();
  });

  test('should delete a user', async () => {
    const { httpTesting, getUsers, user, clickDelete, clickYes, deleteUser } =
      await setup();

    await getUsers({ filters: {}, users: [USER] });

    await waitForAsync(async () => {
      const userToDelete = await user(USER.name);
      expect(userToDelete).toBeDefined();
    });

    await clickDelete(USER.name);

    await clickYes();

    await deleteUser({ user: USER });

    await getUsers({ filters: {}, users: [] });

    await waitForAsync(async () => {
      const deletedUser = await user(USER.name);
      expect(deletedUser).toBeUndefined();
    });

    httpTesting.verify();
  });
});
