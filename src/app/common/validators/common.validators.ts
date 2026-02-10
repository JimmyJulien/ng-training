import { rxResource } from '@angular/core/rxjs-interop';
import {
  customError,
  debounce,
  SchemaPath,
  validate,
  validateAsync,
} from '@angular/forms/signals';
import { Observable } from 'rxjs';

export function stringBetween({
  path,
  min,
  max,
}: {
  path: SchemaPath<string>;
  min: number;
  max: number;
}) {
  validate(path, (ctx) => {
    const value = ctx.value();

    if (!value) {
      return null;
    }

    if (value.length < min || value.length > max) {
      return customError({
        kind: 'string_between',
        message: `Value must be between ${min} and ${max} characters`,
      });
    }

    return null;
  });
}

export function unique({
  path,
  checkFn,
  debounceTime = 500,
}: {
  path: SchemaPath<string>;
  checkFn: (params: string) => Observable<boolean>;
  debounceTime?: number;
}) {
  debounce(path, debounceTime);

  validateAsync(path, {
    params: ({ value }) => value(),
    factory: (value) =>
      rxResource({
        params: value,
        stream: ({ params }) => {
          return checkFn(params);
        },
      }),
    onSuccess: (existing) => {
      if (existing) {
        return customError({
          kind: 'unique',
          message: 'This value is unavailable',
        });
      }
      return null;
    },
    onError: (error) => {
      console.error('Error during validation', error);
      return null;
    },
  });
}
