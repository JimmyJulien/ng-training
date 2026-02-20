import { HttpParams, HttpRequest } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { Routes } from '@angular/router';
import { deepEqual } from '@common/utils/compare.utils';
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

const logHttpAttributeDiff = ({
  functionName,
  attribute,
  expected,
  received,
}: {
  functionName: string;
  attribute: 'method' | 'url' | 'params' | 'body';
  expected: unknown;
  received: unknown;
}) => {
  console.log(`${functionName} wrong ${attribute}`);
  console.log('expected:');
  console.log(expected);
  console.log('received:');
  console.log(received);
};

const checkHttpMethod = ({
  functionName,
  expected,
  received,
}: {
  functionName: string;
  expected: string;
  received: string;
}) => {
  if (expected !== received) {
    logHttpAttributeDiff({
      functionName,
      attribute: 'method',
      expected,
      received,
    });
    return false;
  }
  return true;
};

const checkHttpParams = ({
  functionName,
  expected,
  received,
}: {
  functionName: string;
  expected: Record<string, unknown>;
  received: HttpParams;
}) => {
  const convertedReceived = {} as Record<string, unknown>;

  received.keys().forEach((key) => {
    convertedReceived[key] = received.get(key);
  });

  if (!deepEqual(expected, convertedReceived)) {
    logHttpAttributeDiff({
      functionName,
      attribute: 'params',
      expected,
      received,
    });
    return false;
  }
  return true;
};

const checkHttpUrl = ({
  functionName,
  expected,
  received,
}: {
  functionName: string;
  expected: string;
  received: string;
}) => {
  if (expected !== received) {
    logHttpAttributeDiff({
      functionName,
      attribute: 'url',
      expected,
      received,
    });
    return false;
  }
  return true;
};

const checkHttpBody = ({
  functionName,
  expected,
  received,
}: {
  functionName: string;
  expected: unknown;
  received: unknown;
}) => {
  if (!deepEqual(expected, received)) {
    logHttpAttributeDiff({
      functionName,
      attribute: 'body',
      expected,
      received,
    });
    return false;
  }
  return true;
};

export const httpGet = ({
  httpTesting,
  apiUrl,
  params,
  successData,
  errorData,
}: {
  httpTesting: HttpTestingController;
  apiUrl: string;
  params: Record<string, unknown>;
  successData?: unknown;
  errorData?: HttpErrorData;
}) => {
  const req = httpTesting.expectOne(
    (request: HttpRequest<Record<string, unknown>>) => {
      const functionName = httpGet.name;

      const methodIsOk = checkHttpMethod({
        functionName,
        expected: 'GET',
        received: request.method,
      });

      const urlIsOk = checkHttpUrl({
        functionName,
        expected: apiUrl,
        received: request.url,
      });

      const paramsAreOk = checkHttpParams({
        functionName,
        expected: params,
        received: request.params,
      });

      return methodIsOk && urlIsOk && paramsAreOk;
    },
  );

  if (successData) {
    req.flush(successData);
  }

  if (errorData) {
    const { message, status, statusText } = errorData;
    req.flush(message, { status, statusText });
  }
};

export const httpPost = ({
  httpTesting,
  apiUrl,
  body,
  successData,
  errorData,
}: {
  httpTesting: HttpTestingController;
  apiUrl: string;
  body: unknown;
  successData?: unknown;
  errorData?: HttpErrorData;
}) => {
  const req = httpTesting.expectOne((request) => {
    const functionName = httpPost.name;

    const methodIsOk = checkHttpMethod({
      functionName,
      expected: 'POST',
      received: request.method,
    });

    const urlIsOk = checkHttpUrl({
      functionName,
      expected: apiUrl,
      received: request.url,
    });

    const bodyIsOk = checkHttpBody({
      functionName,
      expected: body,
      received: request.body,
    });

    return methodIsOk && urlIsOk && bodyIsOk;
  });

  if (successData) {
    req.flush(successData);
  }

  if (errorData) {
    const { message, status, statusText } = errorData;
    req.flush(message, { status, statusText });
  }
};

export const httpPut = ({
  httpTesting,
  apiUrl,
  body,
  successData,
  errorData,
}: {
  httpTesting: HttpTestingController;
  apiUrl: string;
  body: unknown;
  successData?: unknown;
  errorData?: HttpErrorData;
}) => {
  const req = httpTesting.expectOne((request) => {
    const functionName = httpPut.name;

    const methodIsOk = checkHttpMethod({
      functionName,
      expected: 'PUT',
      received: request.method,
    });

    const urlIsOk = checkHttpUrl({
      functionName,
      expected: apiUrl,
      received: request.url,
    });

    const bodyIsOk = checkHttpBody({
      functionName,
      expected: body,
      received: request.body,
    });

    return methodIsOk && urlIsOk && bodyIsOk;
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
    const functionName = httpDelete.name;

    const methodIsOk = checkHttpMethod({
      functionName,
      expected: 'DELETE',
      received: request.method,
    });

    const urlIsOk = checkHttpUrl({
      functionName,
      expected: apiUrl,
      received: request.url,
    });

    return methodIsOk && urlIsOk;
  });

  if (successData !== undefined) {
    req.flush(successData);
  }

  if (errorData) {
    const { message, status, statusText } = errorData;
    req.flush(message, { status, statusText });
  }
};
