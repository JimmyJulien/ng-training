import { resource } from '@angular/core';
import {
  customError,
  debounce,
  SchemaPath,
  validate,
  validateAsync,
} from '@angular/forms/signals';

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
  checkFn: (params: string) => Promise<boolean>;
  debounceTime?: number;
}) {
  debounce(path, debounceTime);

  validateAsync(path, {
    params: ({ value }) => value(),
    factory: (value) =>
      resource({
        params: value,
        loader: ({ params }) => {
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
