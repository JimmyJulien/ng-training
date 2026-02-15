import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { appProviders } from '@core/providers/app.providers';
import { screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {
  USER,
  USER_UNDER_16,
  USER_WITH_PETS,
} from '@testing/data/testing.data';
import { UserTestingRepository } from '@testing/repositories/user.testing-repository';
import {
  button,
  clickButton,
  dialog,
  renderApp,
  typeInInput,
} from '@testing/utils/testing.utils';
import { UserRepository } from '../user.repository';
import { UserSearchingPage } from './user-searching.page';

const setup = async () => {
  const renderResult = await renderApp({
    routes: [
      {
        path: '',
        component: UserSearchingPage,
      },
    ],
    providers: [
      ...appProviders,
      {
        provide: UserRepository,
        useClass: UserTestingRepository,
      },
    ],
  });

  const user = async (name: string) => {
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
    renderResult,
    createButton,
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
  };
};

describe('UserSearchingPage', () => {
  test('should show 3 users', async () => {
    await renderApp({
      routes: [
        {
          path: '',
          component: UserSearchingPage,
        },
      ],
    });

    const httpTesting = TestBed.inject(HttpTestingController);

    await waitFor(() => {
      const req = httpTesting.expectOne('http://localhost:3000/users');
      req.flush([USER, USER_UNDER_16, USER_WITH_PETS]);
    });

    const user1 = await screen.findByText(USER.name);
    const user2 = await screen.findByText(USER_UNDER_16.name);
    const user3 = await screen.findByText(USER_WITH_PETS.name);

    await expect.soft(user1).toBeDefined();
    await expect.soft(user2).toBeDefined();
    await expect.soft(user3).toBeDefined();

    httpTesting.verify();
  });

  test('should create a user', async () => {
    const {
      user,
      clickCreate,
      clickSubmit,
      typeName,
      typeEmail,
      typeBirthdate,
      typePassword,
      typeConfirmPassword,
    } = await setup();

    const newUserName = Date.now().toString();

    await waitForAsync(async () => {
      const newUser = await user(newUserName);
      expect(newUser).toBeUndefined();
    });

    await clickCreate();

    await typeName(newUserName);
    await typeEmail(`${newUserName}@mail.fr`);
    await typeBirthdate('01/01/1991');
    await typePassword(newUserName);
    await typeConfirmPassword(newUserName);
    await clickSubmit();

    await waitForAsync(async () => {
      const newUser = await user(newUserName);
      expect(newUser).toBeDefined();
    });
  });

  test('should update a user', async () => {
    const { clickEdit, typeName, user, submitButton } = await setup();

    await clickEdit(USER.name);

    const newUserName = Date.now().toString();

    await typeName(newUserName);

    await waitForAsync(async () => {
      const b = await submitButton();
      expect(b.disabled).toBe(false);
      await userEvent.click(b);
    });

    await waitForAsync(async () => {
      const oldUser = await user(USER.name);
      expect(oldUser).toBeUndefined();
      const updatedUser = await user(newUserName);
      expect(updatedUser).toBeDefined();
    });
  });

  test('should delete a user', async () => {
    const { user, clickDelete, clickYes } = await setup();

    await waitForAsync(async () => {
      const userToDelete = await user(USER.name);
      expect(userToDelete).toBeDefined();
    });

    await clickDelete(USER.name);

    await clickYes();

    await waitForAsync(async () => {
      const deletedUser = await user(USER.name);
      expect(deletedUser).toBeUndefined();
    });
  });
});
