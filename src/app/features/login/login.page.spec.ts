import { Component } from '@angular/core';
import { appRoutePaths } from '@core/routes/app.routes';
import {
  clickButton,
  renderApp,
  title,
  typeInInput,
} from '@testing/utils/testing.utils';
import { LoginPage } from './login.page';

@Component({
  selector: 'ngt-fake-user-page',
  template: `<h1>Search users</h1>`,
})
class FakeUserPage {}

async function setup() {
  const renderResult = await renderApp({
    routes: [
      {
        path: '',
        component: LoginPage,
      },
      {
        path: appRoutePaths.USER,
        component: FakeUserPage,
      },
    ],
  });

  const typeInLogin = (value: string) => {
    return typeInInput({ label: /Login/, value });
  };

  const typeInPassword = (value: string) => {
    return typeInInput({ label: /Password/, value });
  };

  const clickLoginButton = () => {
    return clickButton({ label: /Log in/ });
  };

  const checkInvalidCredentials = async () => {
    const invalidCredentialsAlert =
      await renderResult.findByText(/Invalid credentials/);

    expect(invalidCredentialsAlert).toBeDefined();
  };

  const checkMainTitle = async (t: string | RegExp) => {
    const pageTitle = await title({ label: t });
    expect(pageTitle).toBeDefined();
  };

  return {
    renderResult,
    typeInLogin,
    typeInPassword,
    checkInvalidCredentials,
    checkMainTitle,
    clickLoginButton,
  };
}

describe('LoginPage', () => {
  test('should log in', async () => {
    const { typeInLogin, typeInPassword, clickLoginButton, checkMainTitle } =
      await setup();

    await typeInLogin('login');
    await typeInPassword('password');
    await clickLoginButton();

    await checkMainTitle(/Search users/);
  });

  test.each([
    ['login', 'test', 'password'],
    ['password', 'login', 'test'],
    ['credentials', 'test', 'test'],
  ])(
    'should show invalid credentials alert when wrong %s',
    async (_, login, password) => {
      const {
        typeInLogin,
        typeInPassword,
        clickLoginButton,
        checkInvalidCredentials,
      } = await setup();

      await typeInLogin(login);
      await typeInPassword(password);
      await clickLoginButton();

      await checkInvalidCredentials();
    },
  );
});
