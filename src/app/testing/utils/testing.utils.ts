import { HttpRequest } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
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

interface HttpErrorData {
  message: string;
  status: number;
  statusText: string;
}

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

export const form = () => {
  return screen.findByRole('form');
};

export const httpGet = <Params extends object, SuccessData>({
  httpTesting,
  apiUrl,
  params,
  successData,
  errorData,
}: {
  httpTesting: HttpTestingController;
  apiUrl: string;
  params: Params;
  successData?: SuccessData;
  errorData?: HttpErrorData;
}) => {
  const req = httpTesting.expectOne((request: HttpRequest<Params>) => {
    if (request.method !== 'GET') {
      return false;
    }

    if (request.url !== apiUrl) {
      return false;
    }

    for (const [key, value] of Object.entries(params)) {
      if (request.params.get(key) !== value) {
        return false;
      }
    }

    return true;
  });

  if (successData) {
    req.flush(successData);
  }

  if (errorData) {
    const { message, status, statusText } = errorData;
    req.flush(message, { status, statusText });
  }
};

export const httpPost = <Body, SuccessData>({
  httpTesting,
  apiUrl,
  body,
  successData,
  errorData,
}: {
  httpTesting: HttpTestingController;
  apiUrl: string;
  body: Body;
  successData?: SuccessData;
  errorData?: HttpErrorData;
}) => {
  const req = httpTesting.expectOne((request) => {
    if (request.method !== 'POST') {
      return false;
    }

    if (request.url !== apiUrl) {
      return false;
    }

    if (request.body && JSON.stringify(request.body) !== JSON.stringify(body)) {
      return false;
    }

    return true;
  });

  if (successData) {
    req.flush(successData);
  }

  if (errorData) {
    const { message, status, statusText } = errorData;
    req.flush(message, { status, statusText });
  }
};

export const httpPut = <Body, SuccessData>({
  httpTesting,
  apiUrl,
  body,
  successData,
  errorData,
}: {
  httpTesting: HttpTestingController;
  apiUrl: string;
  body: Body;
  successData?: SuccessData;
  errorData?: HttpErrorData;
}) => {
  const req = httpTesting.expectOne((request) => {
    if (request.method !== 'PUT') {
      return false;
    }

    if (request.url !== apiUrl) {
      return false;
    }

    if (request.body && JSON.stringify(request.body) !== JSON.stringify(body)) {
      return false;
    }

    return true;
  });

  if (successData) {
    req.flush(successData);
  }

  if (errorData) {
    const { message, status, statusText } = errorData;
    req.flush(message, { status, statusText });
  }
};

export const httpDelete = ({
  httpTesting,
  apiUrl,
  successData,
  errorData,
}: {
  httpTesting: HttpTestingController;
  apiUrl: string;
  successData?: boolean;
  errorData?: HttpErrorData;
}) => {
  const req = httpTesting.expectOne((request) => {
    if (request.method !== 'DELETE') {
      return false;
    }

    if (request.url !== apiUrl) {
      return false;
    }

    return true;
  });

  if (successData !== undefined) {
    req.flush(successData);
  }

  if (errorData) {
    const { message, status, statusText } = errorData;
    req.flush(message, { status, statusText });
  }
};
