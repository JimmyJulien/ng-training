import { Routes } from '@angular/router';
import { App } from '@core/components/app.component';
import {
  render,
  RenderComponentOptions,
  screen,
  within,
} from '@testing-library/angular';
import userEvent, { Options } from '@testing-library/user-event';
import { testingProviders } from '@testing/providers/testing.providers';

type StringOrRegexp = string | RegExp;

type AppRenderComponentOptions = Omit<RenderComponentOptions<App>, 'routes'> & {
  routes: Routes;
};

export const renderApp = (options?: AppRenderComponentOptions) => {
  return render(App, {
    providers: testingProviders,
    ...options,
  });
};

export const input = ({
  label,
  container,
}: {
  label: StringOrRegexp;
  container?: HTMLElement;
}): Promise<HTMLInputElement> => {
  if (container) {
    return within(container).findByLabelText(label);
  }

  return screen.findByLabelText(label);
};

export const typeInInput = async ({
  label,
  value,
  container,
  options,
}: {
  label: StringOrRegexp;
  value: string;
  container?: HTMLElement;
  options?: Options;
}): Promise<void> => {
  const i = await input({ label, container });
  return userEvent.type(i, value, options);
};

export const button = ({
  label,
  container,
}: {
  label: StringOrRegexp;
  container?: HTMLElement;
}): Promise<HTMLButtonElement> => {
  if (container) {
    return within(container).findByRole('button', { name: label });
  }

  return screen.findByRole('button', { name: label });
};

export const clickButton = async ({
  label,
  container,
}: {
  label: StringOrRegexp;
  container?: HTMLElement;
}): Promise<void> => {
  const b = await button({ label, container });
  return userEvent.click(b);
};

export const title = ({
  label,
  level,
}: {
  label: StringOrRegexp;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}): Promise<HTMLHeadingElement> => {
  return screen.findByRole('heading', {
    level: level ?? 1,
    name: label,
  });
};

export const dialog = () => {
  return screen.findByRole('dialog');
};
