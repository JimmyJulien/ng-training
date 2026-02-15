import { Component } from '@angular/core';
import {
  clickButton,
  renderApp,
  title,
  typeInInput,
} from '@testing/utils/testing.utils';
import { LoginPage } from './login.page';

@Component({
  selector: 'ngt-user-page',
  template: `<h1>Search users</h1>`,
})
class FakeUserPage {}

export const setup = async () => {
  const renderResult = await renderApp({
    routes: [
      { path: '', component: LoginPage },
      { path: 'user', component: FakeUserPage },
    ],
  });

  const typeLogin = (value: string) => {
    return typeInInput({ label: /Login/, value });
  };

  const typePassword = (value: string) => {
    return typeInInput({ label: /Password/, value });
  };

  const clickLoginButton = () => {
    return clickButton({ label: /Log in/ });
  };

  const getUserPageTitle = () => {
    return title({ label: /Search users/ });
  };

  const getInvalidCredentialsError = () => {
    return renderResult.findByText(/Invalid credentials/);
  };

  return {
    renderResult,
    typeLogin,
    typePassword,
    clickLoginButton,
    getUserPageTitle,
    getInvalidCredentialsError,
  };
};

describe('LoginPage', () => {
  test('should log in', async () => {
    const { typeLogin, typePassword, clickLoginButton, getUserPageTitle } =
      await setup();

    await typeLogin('login');
    await typePassword('password');
    await clickLoginButton();

    const pageTitle = await getUserPageTitle();
    await expect(pageTitle).toBeDefined();
  });

  test('should show an invalid credentials error message when wrong login', async () => {
    const {
      typeLogin,
      typePassword,
      clickLoginButton,
      getInvalidCredentialsError,
    } = await setup();

    await typeLogin('test');
    await typePassword('password');
    await clickLoginButton();

    const errorMessage = await getInvalidCredentialsError();
    await expect(errorMessage).toBeDefined();
  });

  test('should show an invalid credentials error message when wrong password', async () => {
    const {
      typeLogin,
      typePassword,
      clickLoginButton,
      getInvalidCredentialsError,
    } = await setup();

    await typeLogin('login');
    await typePassword('test');
    await clickLoginButton();

    const errorMessage = await getInvalidCredentialsError();
    await expect(errorMessage).toBeDefined();
  });
});
